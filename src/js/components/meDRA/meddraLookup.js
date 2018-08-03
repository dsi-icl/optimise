const tree =  require('./meddra.json');
const makeMeddraHash = require('./utils');

const a = makeMeddraHash(tree);
console.log(a);
