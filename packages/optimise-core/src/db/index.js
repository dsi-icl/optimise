const schemasContext = require.context('.', false, /\.table\.js$/);
const schemas = schemasContext.keys().map(file => schemasContext(file)).sort((a, b) => a.PRIORITY - b.PRIORITY).map(descriptor => descriptor.default);

export default schemas;