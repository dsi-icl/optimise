const knex = require('../utils/db-connection');
const formatToJSON = require('../utils/format-response');

function MeddraController() {
    this.MeddraCollection = null;
    this.getMeddraField = MeddraController.prototype.getMeddraField.bind(this);
    this.setMeddraCollection = MeddraController.prototype.setMeddraCollection.bind(this);
    this.loadMeddraCollection = MeddraController.prototype.loadMeddraCollection.bind(this);
    this.loadMeddraCollection();
}

MeddraController.prototype.loadMeddraCollection = function () {
    let that = this;
    return new Promise((resolve, reject) => knex('ADVERSE_EVENT_MEDDRA')
        .select('*')
        .then((result) => {
            that.setMeddraCollection(result);
            return resolve();
        })
        .catch(() => {
            that.setMeddraCollection(null);
            return reject();
        }));
};

MeddraController.prototype.setMeddraCollection = function (collection) {
    this.MeddraCollection = collection;
};

MeddraController.prototype.getMeddraField = async function (req, res) {
    let result = [];
    let maxOccurency = 20;
    if (this.MeddraCollection === null) {
        await this.loadMeddraCollection();
    }
    if (req.query.hasOwnProperty('search')) {
        let j = 0;
        for (let i = 0; i < this.MeddraCollection.length && j < maxOccurency; i++) {
            if (this.MeddraCollection[i].name.indexOf(req.query.search) > -1 || this.MeddraCollection[i].code.indexOf(req.query.search) > -1) {
                result[j] = this.MeddraCollection[i];
                j++;
            }
        }
        res.status(200).json(formatToJSON(result));
        return;
    }
    if (req.query.hasOwnProperty('parent')) {
        let j = 0;
        for (let i = 0; i < this.MeddraCollection.length && j < maxOccurency; i++) {
            if (this.MeddraCollection[i].parent === parseInt(req.query.parent)) {
                result[j] = this.MeddraCollection[i];
                j++;
            }
        }
        res.status(200).json(formatToJSON(result));
        return;
    }
    else {
        res.status(200).json(formatToJSON(this.MeddraCollection));
        return;
    }
};

module.exports = MeddraController;
