const schemasContext = require.context('.', false, /\.table\.js$/);
const schemas = [];

schemasContext.keys().forEach((file) => schemas.push(schemasContext(file).default));

export default schemas;