const fs = require('fs');
const path = require('path');

writeJson = function(data, pathToFile) {
    fs.writeFileSync(path.resolve(pathToFile), JSON.stringify(data));
}

readJson = function(pathToFile) {
    let content = fs.readFileSync(path.resolve(pathToFile));
    return (JSON.parse(content));
}

module.exports = { writeJson, readJson }