/**
 * Build all distributable schemas into the `dist` folder.
 */
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { basename } from 'path';
import { assemble } from './assemble';
const build = async (entry) => {
    const schema = await assemble(entry);
    writeFileSync(`src/${basename(entry, '.yaml')}.json`, JSON.stringify(schema, null, 2), { encoding: 'utf8' });
};
const main = async () => {
    try {
        await Promise.all([
            build('schema/file-format.schema.yaml'),
            build('schema/document.schema.yaml'),
            build('schema/meta.schema.yaml'),
            build('schema/user.schema.yaml'),
            build('schema/layers/page.schema.yaml'),
        ]);
        execSync('yarn prettier --write "src/*.json"');
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
};
main();
