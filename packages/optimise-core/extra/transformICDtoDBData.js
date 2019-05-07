const fs = require('fs');
const csvparse = require('csv-parse');

const parser = csvparse({ columns: true });
const readstream = fs.createReadStream('./simpletabulation.csv', { encoding: 'utf8' });

let tmpParent = [null];
let tmpLevel = 0;
let lastNode = null;
let id = 1;
let data = [];

function getCurrentParent(tmpParent) {
    return tmpParent[tmpParent.length - 1];
}

parser.on('readable', () => {
    let line;
    while (line = parser.read()) { // eslint-disable-line
        const match = /([ -]*)(.*)/.exec(line.Title);
        const title = match[2].trim();
        const level = match[1].split('-').length - 1;
        const isLeaf = line.isLeaf === 'True';
        const code = line.Code || line.BlockId || line.ChapterNo;

        if (level > tmpLevel) {
            tmpParent.push(lastNode.id);
            tmpLevel = level;
        } else if (level < tmpLevel) {
            for (let i = 0; i < tmpLevel - level; i++) {
                tmpParent.pop();
            }
            tmpLevel = level;
        }
        const parent = getCurrentParent(tmpParent);

        const node = {
            name: title,
            parent,
            isLeaf,
            deleted: '-',
            id,
            code
        };

        lastNode = node;
        data.push(node);
        process.stdout.write(`Entries processed: ${id}                      \r`);
        id++;
    }
});

parser.on('end', () => {
    fs.writeFileSync('../src/db/defaults_v2/icd11_data.json', JSON.stringify(data), 'utf8');
});

readstream.pipe(parser);
