// We need to mock require.context() for Jest environment
if (process.env.NODE_ENV === 'test')
    require('babel-plugin-require-context-hook/register')();

const schemasContext = require.context('.', false, /\.table\.js$/);
const schemas = schemasContext.keys().map(file => schemasContext(file)).sort((a, b) => a.PRIORITY - b.PRIORITY).map(descriptor => descriptor.default);

export default schemas;
