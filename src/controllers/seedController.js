/**
 * @class SeedController
 * @description Handle various way to interact with the seeded "constant" data (i.e. fields / types)
 */

const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const formatToJSon = require('../utils/format-response');
const message = require('../utils/message-utils');
const modelsContainer = require('../utils/model-container');


const mapKeyTable = {
    fieldVisit: 'AVAILABLE_FIELDS_VISITS',
    fieldTest: 'AVAILABLE_FIELDS_TESTS',
    fieldCE: 'AVAILABLE_FIELDS_CE',
    typeVisit: 'AVAILABLE_VISIT_TYPES',
    typeCE: 'AVAILABLE_CLINICAL_EVENT_TYPES',
    typeTest: 'AVAILABLE_TEST_TYPES'
};

function SeedController() {
    this.getSeed = SeedController.prototype.getSeed.bind(this);
    this.createSeed = SeedController.prototype.createSeed.bind(this);
    this.deleteSeed = SeedController.prototype.deleteSeed.bind(this);
    this.editSeed = SeedController.prototype.editSeed.bind(this);
}

/**
 * @function getSeed
 * @description answer a get request on the url /seeds/:target where target is contained in mapKeyTable
 * @return Either all the table or the asked row
 */
SeedController.prototype.getSeed = function (req, res) {
    if (req.params.hasOwnProperty('target') && mapKeyTable.hasOwnProperty(req.params.target)) {
        let whereObj = (req.hasOwnProperty('query') && req.query.length !== 0) ? req.query : {};
        getEntry(mapKeyTable[req.params.target], whereObj, '*').then(function (result) {
            res.status(200).json(formatToJSon(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return;
        });
    } else if (!req.params.hasOwnProperty('target')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        return;
    }
};

SeedController.prototype.createSeed = function (req, res) {
    if (req.params.hasOwnProperty('target') && mapKeyTable.hasOwnProperty(req.params.target)) {
        console.log(JSON.stringify(modelsContainer));
        for (let i = 0; i < Object.keys(modelsContainer[req.params.target]).length; i++) {
            if (Object.keys(modelsContainer[req.params.target])[i] === 'id') {
                continue;
            }
            if (!req.body.hasOwnProperty(Object.keys(modelsContainer[req.params.target])[i])) {
                res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
                return;
            }
            if (typeof req.body[Object.keys(modelsContainer[req.params.target])[i]] === typeof modelsContainer[req.params.target][i]) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }
        }
        createEntry(mapKeyTable[req.params.target], req.body).then(function (result) {
            res.status(200).json(formatToJSon(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else if (!req.params.hasOwnProperty('target')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        return;
    }
};

SeedController.prototype.editSeed = function (req, res) {
    if (req.params.hasOwnProperty('target') && mapKeyTable.hasOwnProperty(req.params.target)) {
        let newEntry = {};
        let whereObj = {};
        if (req.user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        for (let i = 0; i < Object.keys(modelsContainer[req.params.target]).length; i++) {
            if (!req.body.hasOwnProperty(Object.keys(modelsContainer[req.params.target])[i])) {
                res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
                return;
            }
            if (typeof req.body[Object.keys(modelsContainer[req.params.target])[i]] === typeof modelsContainer[req.params.target][i]) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }
            if (Object.keys(modelsContainer[req.params.target])[i] === 'id') {
                whereObj.id = req.body.id;
            } else {
                newEntry[Object.keys(modelsContainer[req.params.target])[i]] = req.body[Object.keys(modelsContainer[req.params.target])[i]];
            }
        }
        updateEntry(mapKeyTable[req.params.target], req.user, '*', whereObj, newEntry).then(function (result) {
            res.status(200).json(formatToJSon(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else if (!req.params.hasOwnProperty('target')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        return;
    }
};

SeedController.prototype.deleteSeed = function (req, res) {
    if (req.params.hasOwnProperty('target') && mapKeyTable.hasOwnProperty(req.params.target)) {
        let whereObj = {};
        if (req.user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        for (let i = 0; i < Object.keys(modelsContainer[req.params.target]).length; i++) {
            if (!req.body.hasOwnProperty(Object.keys(modelsContainer[req.params.target])[i])) {
                res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
                return;
            }
            if (typeof req.body[Object.keys(modelsContainer[req.params.target])[i]] === typeof modelsContainer[req.params.target][i]) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }
            if (Object.keys(modelsContainer[req.params.target])[i] === 'id') {
                whereObj.id = req.body.id;
            }
        }
        deleteEntry(mapKeyTable[req.params.target], req.user, whereObj).then(function (result) {
            res.status(200).json(formatToJSon(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else if (!req.params.hasOwnProperty('target')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        return;
    }
};

module.exports = SeedController;