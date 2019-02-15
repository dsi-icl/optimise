const dbcon = require('../utils/db-connection').default;
const formatToJSON = require('../utils/format-response');
const MeddraHierarchyProcessor = require('../core/MeddraHierarchyProcessor');

function MeddraController() {
    this.MeddraCollection = null;
    this.getMeddraField = MeddraController.prototype.getMeddraField.bind(this);
    this.setMeddraCollection = MeddraController.prototype.setMeddraCollection.bind(this);
    this.loadMeddraCollection = MeddraController.prototype.loadMeddraCollection.bind(this);
    this.handleMeddraUploadByAdmin = MeddraController.prototype.handleMeddraUploadByAdmin.bind(this);
    this.loadMeddraCollection();
}

MeddraController.prototype.handleMeddraUploadByAdmin = function (req, res) {
    if (req.user.priv !== 1) {
        res.status(401).json({ error: 'Not authorized.' });
        return;
    }
    if (!req.files.mdhierfile || req.files.mdhierfile.length !== 1) {
        res.status(400).json({ error: 'Cannot read file.' });
        return;
    }

    const mdhierfile = req.files.mdhierfile[0];
    const lltfile = req.files.lltfile && req.files.lltfile[0];

    let result;
    try {
        const processor = new MeddraHierarchyProcessor(mdhierfile, lltfile);
        processor.parsebuffer();
        result = processor.transformData();
    } catch (e) {
        res.status(400).json({ error: e });
        return null;
    }

    dbcon.batchInsert('ADVERSE_EVENT_MEDDRA', result, 10)
        .then(() => {
            res.status(200).json({ message: 'Meddra uploaded.' });
            this.loadMeddraCollection();
            return null;
        })
        .catch(err => { res.status(500).json({ error: err }); });
};

MeddraController.prototype.loadMeddraCollection = function () {
    let that = this;
    return new Promise((resolve, reject) => dbcon('ADVERSE_EVENT_MEDDRA')
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
    await this.loadMeddraCollection();
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
