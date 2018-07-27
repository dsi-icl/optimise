const fs = require('fs');

const writeJson = function (data, pathToFile) {
    fs.writeFileSync(pathToFile, JSON.stringify(data));
};

const readJson = function (pathToFile) {
    let content = fs.readFileSync(pathToFile);
    return (JSON.parse(content));
};

module.exports = { writeJson: writeJson, readJson: readJson };