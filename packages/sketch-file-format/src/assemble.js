/**
 * Gather yaml files, process and assemble them into a single top-level JSON
 * schema file, defined by the entry path passed to this assemble function. The
 * resulting schema file will be standalone - only containing internal refs to
 * definitions, and no external file references.
 *
 * Performs the following steps:
 *
 *   - Loads YAML from the file system and converts to POJOs in memory
 *   - Ensures all `object` schemas have `additionalProperties` set to `false`
 *   - Replaces any references to abstract schemas with concrete schema contents
 *   - Simplify the schemas by merging any `allOf` arrays into single unions
 *   - Prune any un-used definitions
 */
import yaml from 'js-yaml';
import fs from 'fs';
import globby from 'globby';
import changeCase from 'change-case';
import { basename } from 'path';
import deepdash from 'deepdash';
import _ from 'lodash';
import jsont from 'json-transforms';
import mergeAllOf from 'json-schema-merge-allof';
deepdash(_);
/**
 * Given a file path to a schema return an appropriate id.
 *
 *   Input:  ./schemas/foo-bar.schema.yaml
 *   Output: FooBar
 */
const pathToId = (path) => changeCase.pascalCase(basename(path, '.schema.yaml'));
/**
 * Returns a Promise that resolves with the POJO representation of
 * a YAML file on disk. Schema objects are injected with an $id based on
 * their file name.
 */
const loadSchema = (path) => new Promise((resolve, reject) => {
    try {
        const schema = {
            ...yaml.load(fs.readFileSync(path, 'utf8')),
            $id: `#${pathToId(path)}`,
        };
        resolve(schema);
    }
    catch (e) {
        reject(e);
    }
});
/**
 * Given a minimatch glob pattern, returns all matching schemas in an object
 * keyed by $id.
 */
const gatherDefinitions = async (pattern) => {
    const paths = await globby(pattern);
    const schemas = await Promise.all(paths.map(loadSchema));
    const acc = {};
    return schemas.reduce((acc, curr) => ({
        ...acc,
        [curr.$id.substring(1)]: curr,
    }), acc);
};
/**
 * Recursively scans a schema, noting which definitions have been referenced.
 * Any un-referenced definitions are removed. Passed-in schema is modified
 * in-place.
 */
const prune = (schema) => {
    let ids = [];
    const scan = (o) => {
        if (typeof o !== 'object')
            return;
        for (let [k, v] of Object.entries(o)) {
            if (k === '$ref') {
                const id = [...v.split('/')].pop();
                if (!ids.includes(id)) {
                    ids.push(id);
                    scan(schema.definitions[id]);
                }
            }
            else if (typeof v === 'object') {
                scan(v);
            }
            else if (Array.isArray(v)) {
                v.forEach(el => {
                    if (typeof el === 'object') {
                        scan(v);
                    }
                });
            }
        }
    };
    scan(schema.properties);
    scan(schema.additionalProperties);
    scan(schema.propertyNames);
    ids = _.uniq(ids);
    schema.definitions = _.pick(schema.definitions, ids);
};
/**
 * Add `additionalProperties: false` to every object schema, unless it already
 * has an explicit value.
 */
const setAdditionalPropsFalse = (schema) => {
    const scan = (o) => {
        if (typeof o !== 'object')
            return;
        if (o.type === 'object' && typeof o.additionalProperties === 'undefined') {
            o.additionalProperties = false;
        }
        for (let [, v] of Object.entries(o)) {
            if (typeof v === 'object') {
                scan(v);
            }
            else if (Array.isArray(v)) {
                v.forEach(el => {
                    if (typeof el === 'object') {
                        scan(v);
                    }
                });
            }
        }
    };
    scan(schema);
};
/**
 * Mark all object schema properties as required, unless mentioned in a
 * `optional` array.
 */
const setAllPropsRequired = (schema) => {
    const scan = (o) => {
        if (typeof o !== 'object')
            return;
        if (o.type === 'object' && typeof o.properties === 'object') {
            const optional = Array.isArray(o.optional) ? o.optional : [];
            o.required = _.difference(Object.keys(o.properties), optional);
            delete o.optional;
        }
        for (let [, v] of Object.entries(o)) {
            if (typeof v === 'object') {
                scan(v);
            }
            else if (Array.isArray(v)) {
                v.forEach(el => {
                    if (typeof el === 'object') {
                        scan(v);
                    }
                });
            }
        }
    };
    scan(schema);
};
/**
 * Process the entry schema into a single simplified, pruned, distributable schema.
 */
const assemble = async (entry) => {
    const abstractSchemas = await gatherDefinitions('**/*abstract*.schema.yaml');
    const pkg = (await import('../package.json')).default;
    const $schema = 'http://json-schema.org/draft-07/schema#';
    const $id = `https://unpkg.com/${pkg.name}@${pkg.version}/dist/${basename(entry, '.yaml')}.json`;
    let output = {
        ...(await loadSchema(entry)),
        $schema,
        $id,
        definitions: await gatherDefinitions('**/*.schema.yaml'),
    };
    // Abstract schemas are a device to reduce code duplication while schema
    // authoring, they aren't a concept we want to leak into the final schema
    // output. So replace file $refs to abstract schemas with the abstract schema
    // contents. We do this repeatedly until there are no references to abstract
    // schemas at all (to handle abstract schemas that reference abstract schemas)
    let containsAbstractRefs = true;
    while (containsAbstractRefs) {
        containsAbstractRefs = false;
        output = jsont.transform(output, [
            jsont.pathRule('.$ref', ({ context, match }) => {
                if (typeof match === 'string' && match.includes('abstract')) {
                    const { title, description, $id, $ref, ...rest } = abstractSchemas[pathToId(match)];
                    return _.cloneDeep(rest);
                }
                else {
                    return context;
                }
            }),
            jsont.identity,
        ]);
        // @ts-ignore
        _.eachDeep(output, (v, k) => {
            if (k === '$ref' && v.includes('abstract')) {
                containsAbstractRefs = true;
            }
        });
    }
    // Convert all $refs from file paths to pointers into the definitions object
    //    From: { $ref: '../enums/fill-type.schema.yaml' }
    //    To: { $ref: '#/definitions/FillType' }
    // @ts-ignore
    output = _.mapDeep(output, (v, k) => k === '$ref' ? `#/definitions/${pathToId(v)}` : v);
    // Further processing
    setAllPropsRequired(output);
    output = mergeAllOf(output, { ignoreAdditionalProperties: true });
    prune(output);
    setAdditionalPropsFalse(output);
    return output;
};
export { assemble };
