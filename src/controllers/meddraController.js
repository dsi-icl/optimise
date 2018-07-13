const knex = require('../utils/db-connection');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

function Meddra() {
    let that = this;
    this.MeddraCollection = null;
    this.getMeddraField = Meddra.prototype.getMeddraField.bind(this);
    this.setMeddraCollection = Meddra.prototype.setMeddraCollection.bind(this);
    knex('ADVERSE_EVENT_MEDDRA').select('*').then(function (result) {
        that.setMeddraCollection(result);
    }, function () {
        that.setMeddraCollection(null);
    });
}

Meddra.prototype.setMeddraCollection = function (collection) {
    this.MeddraCollection = collection;
};

Meddra.prototype.getMeddraField = function (req, res) {
    let result = [];
    let maxOccurency = 20;
    if (this.MeddraCollection === null) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL));
        return;
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

module.exports = Meddra;