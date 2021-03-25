/**
 * This file is the entry point to the published npm module.
 */
import fileFormatSchema from './file-format.schema.json';
import docSchema from './document.schema.json';
import metaSchema from './meta.schema.json';
import pageSchema from './page.schema.json';
import userSchema from './user.schema.json';
const schemas = {
    version: [...metaSchema.properties.version.enum].pop() || 0,
    versions: [...metaSchema.properties.version.enum],
    fileFormat: fileFormatSchema,
    document: docSchema,
    meta: metaSchema,
    page: pageSchema,
    user: userSchema,
};
export default schemas;
