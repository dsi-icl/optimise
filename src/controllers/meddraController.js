const knex = require('../utils/db-connection');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

function MeddraController() {
    this.MeddraCollection = null;
    this.getMeddraField = MeddraController.prototype.getMeddraField.bind(this);
    this.setMeddraCollection = MeddraController.prototype.setMeddraCollection.bind(this);
    this.loadMeddraCollection = MeddraController.prototype.loadMeddraCollection.bind(this);
    this.loadMeddraCollection();
}

MeddraController.prototype.loadMeddraCollection = function () {
    let that = this;
    return new Promise(function (resolve, reject) {
        knex('ADVERSE_EVENT_MEDDRA').select('*').then(function (result) {
            that.setMeddraCollection(result);
            resolve();
        }, function () {
            that.setMeddraCollection(null);
            reject();
        });
    });
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
            if (this.MeddraCollection[i].name.indexOf(req.query.search) > -1) {
                result[j] = this.MeddraCollection[i];
                j++;
            }
        }
        res.status(200).json(result);
        return;
    }
    else {
        res.status(200).json(this.MeddraCollection);
        return;
    }
};

module.exports = MeddraController;
