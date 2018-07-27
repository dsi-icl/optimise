const fs = require('fs');
const path = require('path');

const writeJson = function (data, pathToFile) {
    fs.writeFileSync(path.resolve(pathToFile), JSON.stringify(data));
};

const readJson = function (pathToFile) {
    let content = fs.readFileSync(path.resolve(pathToFile));
    return (JSON.parse(content));
};

module.exports = { writeJson: writeJson, readJson: readJson };