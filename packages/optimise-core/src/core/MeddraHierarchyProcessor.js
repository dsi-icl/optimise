const Papa = require('papaparse');

function MeddraHierarchyProcessor(file) {
    this.parsebuffer = MeddraHierarchyProcessor.prototype.parsebuffer.bind(this);
    this.transformData = MeddraHierarchyProcessor.prototype.transformData.bind(this);
    this.file = file;
    this.data = [];
}

MeddraHierarchyProcessor.prototype.parsebuffer = function () {
    const parser = Papa.parse(this.file.buffer.toString(), {
        delimiter: '$',
        header: false
    });
    this.data = parser.data;
};

MeddraHierarchyProcessor.prototype.transformData = function() {
    // {
    //     code: ###
    //     name: ''
    //     parent: ###
    //     isLeaf
    // }
    const names = {};
    const parents = {};

    this.data.forEach(el => {
        for (let i = 0; i < 4; i++) {
            if (el[i] !== undefined && el[i] !== '') {
                names[el[i]] = el[i + 4];
                if (i < 3 && el[i + 1] !== undefined) {
                    if (parents[el[i]] === undefined) {
                        parents[el[i]] = new Set([el[i + 1]]);
                    } else {
                        parents[el[i]].add(el[i + 1]);
                    }
                }
            }
        }
    });

    const transformedData = [];
    let id = 1;
    Object.keys(parents).forEach(key => {
        let array = Array.from(parents[key]);
        for (let i = 0; i < array.length; i++) {
            transformedData.push({
                id,
                code: key,
                name: names[key] || 'Unknown name',
                parentCode: array[i]
            });
            id++;
        }
    });

    const idHash = {};
    transformedData.forEach(el => {
        if (!el.code) {
            throw Error(el.code);
        }
        idHash[el.code] = el.id;
    });

    transformedData.forEach(el => {
        
    });
    console.log(idHash);
};

module.exports = MeddraHierarchyProcessor;