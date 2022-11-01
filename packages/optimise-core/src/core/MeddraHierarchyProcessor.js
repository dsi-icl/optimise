import Papa from 'papaparse';

class MeddraHierarchyProcessor {
    constructor(startingId, hierfile, lltfile) {
        this.startingId = startingId;
        this.hierfile = hierfile;
        this.lltfile = lltfile;
        this.hierdata = [];
        this.lltdata = [];
    }

    parsebuffer() {
        const hierparser = Papa.parse(this.hierfile.buffer.toString(), {
            delimiter: '$',
            header: false
        });
        this.hierdata = hierparser.data;

        if (this.lltfile) {
            const lltparser = Papa.parse(this.lltfile.buffer.toString(), {
                delimiter: '$',
                header: false,
                quoteChar: '\t',
                escapeChar: '\t'
            });
            this.lltdata = lltparser.data;
        }
    }

    transformData() {
        const names = {};
        const parents = {};
        const leafs = [];

        this.hierdata.forEach(el => {
            if (!this.lltfile) {
                leafs.push(el[0]);
            }
            for (let i = 0; i < 4; i++) {
                if (el[i] !== undefined && el[i] !== '') {
                    names[el[i]] = el[i + 4];
                    if (i < 3 && el[i + 1] !== undefined) {
                        if (parents[el[i]] === undefined) {
                            parents[el[i]] = new Set([el[i + 1]]);
                        } else {
                            parents[el[i]].add(el[i + 1]);
                        }
                    } else if (i === 3) {
                        parents[el[i]] = null;
                    }
                }
            }
        });

        this.lltdata.forEach(el => {
            leafs.push(el[0]);
            if (el.length !== 12) return;
            names[el[0]] = el[1];
            if (parents[el[0]] === undefined) {
                parents[el[0]] = new Set([el[2]]);
            } else {
                parents[el[0]].add(el[2]);
            }
        });

        const transformedData = [];
        let id = this.startingId;
        Object.keys(parents).forEach(key => {
            if (parents[key] === null) {
                transformedData.push({
                    id,
                    code: key,
                    name: names[key] || 'Unknown name',
                    parentCode: null,
                    isLeaf: 0
                });
                id++;
            } else {
                const array = Array.from(parents[key]);
                for (let i = 0; i < array.length; i++) {
                    if (key !== array[i]) {
                        transformedData.push({
                            id,
                            code: key,
                            name: names[key] || 'Unknown name',
                            parentCode: array[i],
                            isLeaf: leafs.includes(key) ? 1 : 0
                        });
                        id++;
                    }
                }
            }
        });

        const idHash = {};
        transformedData.forEach(el => {
            if (!el.code) {
                throw Error(el.code);
            }
            idHash[el.code] = el.id;
        });
        transformedData.map(el => {
            el.parent = idHash[el.parentCode] || el.parentCode;
            delete el.parentCode;
            return el;
        });

        return transformedData;
    }
}

export default MeddraHierarchyProcessor;