/*eslint no-console: "off"*/
/**
 * @class SeedController
 * @description Handle various way to interact with the seeded "constant" data (i.e. fields / types)
 */

const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const formatToJSon = require('../utils/format-response');
const message = require('../utils/message-utils');
const modelsContainer = require('../utils/model-container');
const { writeJson } = require('../utils/load-json');

const path = './db/availableFields/jsonFiles/';

const mapKeyTable = {
    fieldVisit: {
        table: 'AVAILABLE_FIELDS_VISITS',
        file: 'visitFields.json',
        referenced:
            [{ table: 'VISIT_DATA', column: 'field' }]
    },
    fieldTest: {
        table: 'AVAILABLE_FIELDS_TEST',
        file: 'testFields.json',
        referenced:
            [{ table: 'TEST_DATA', column: 'field' }]
    },
    fieldCE: {
        table: 'AVAILABLE_FIELDS_CE',
        file: 'ceFields.json',
        referenced:
            [{ table: 'CLINICAL_EVENTS_DATA', column: 'field' }]
    },
    typeVisit: {
        table: 'AVAILABLE_VISIT_TYPES',
        file: 'visitTypes.json',
        referenced:
            [{ table: 'AVAILABLE_FIELDS_VISITS', colunm: 'referenceType' }, { table: 'VISITS', column: 'type' }]
    },
    typeCE: {
        table: 'AVAILABLE_CLINICAL_EVENT_TYPES',
        file: 'ceTypes.json',
        referenced:
            [{ table: 'AVAILABLE_FIELDS_CE', column: 'referenceType' }, { table: 'CLINICAL_EVENTS', column: 'type' }]
    },
    typeTest: {
        table: 'AVAILABLE_TEST_TYPES',
        file: 'testTypes.json',
        referenced:
            [{ table: 'AVAILABLE_FIELDS_TESTS', column: 'referenceType' }, { table: 'ORDERED_TESTS', column: 'type' }]
    }
};

function SeedController() {
    this.getSeedList = SeedController.prototype.getSeedList.bind(this);
    this.getSeed = SeedController.prototype.getSeed.bind(this);
    this.createSeed = SeedController.prototype.createSeed.bind(this);
    this.deleteSeed = SeedController.prototype.deleteSeed.bind(this);
    this.editSeed = SeedController.prototype.editSeed.bind(this);
    this.updateFiles = SeedController.prototype.updateFiles.bind(this);
}

/**
 * @function getSeedList
 * @description Lists the url requestable. (e.g. /seeds/fieldVisit, /seeds/fieldTest, ...)
 * @param {*} ___unused__req request, not used
 * @param {*} res response, contain the list.
 * @returns {void} Answer the client with the list of seed implemented
 */
SeedController.prototype.getSeedList = function (__unused__req, res)  {
    let list = [];
    Object.keys(mapKeyTable).forEach(key => list.push(key));
    res.status(200).json(formatToJSon(list));
    return;
};

/**
 * @function getSeed
 * @description answer a get request on the url /seeds/:target where target is contained in mapKeyTable
 * @return Either all the table or the asked row
 */
SeedController.prototype.getSeed = function (req, res)  {
    if (req.params.hasOwnProperty('target') && mapKeyTable.hasOwnProperty(req.params.target)) {
        let whereObj = (req.hasOwnProperty('query') && req.query.length !== 0) ? req.query : {};
        return getEntry(mapKeyTable[req.params.target].table, whereObj, '*').then((result) => {
            res.status(200).json(formatToJSon(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    } else if (!req.params.hasOwnProperty('target')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        return;
    }
};

/**
 * @function createSeed
 * @description Add a seed entry to the DB if it match the allowed list
 * @param {*} req Request form sender
 * @param {*} res Answerable object.
 * @returns {void} Either errors if the request isn't allowed or the ID(s) of the new created seed(s)
 */
SeedController.prototype.createSeed = function (req, res)  {
    if (req.params.hasOwnProperty('target') && mapKeyTable.hasOwnProperty(req.params.target)) {
        for (let i = 0; i < Object.keys(modelsContainer[req.params.target]).length; i++) {
            if (Object.keys(modelsContainer[req.params.target])[i] === 'id') {
                continue;
            }
            if (!req.body.hasOwnProperty(Object.keys(modelsContainer[req.params.target])[i])) {
                res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
                return;
            }
            if (modelsContainer[req.params.target][Object.keys(modelsContainer[req.params.target])[i]] !== null &&
                typeof req.body[Object.keys(modelsContainer[req.params.target])[i]] !== typeof modelsContainer[req.params.target][Object.keys(modelsContainer[req.params.target])[i]]) {
                res.status(400).json(ErrorHelper(`${message.userError.WRONGARGUMENTS} : ${Object.keys(modelsContainer[req.params.target])[i]}`));
                return;
            }
        }
        return createEntry(mapKeyTable[req.params.target].table, req.body).then((result) => {
            res.status(200).json(formatToJSon(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    } else if (!req.params.hasOwnProperty('target')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        return;
    }
};

/**
 * @function editSeed
 * @description Update a seed with the sended info
 * @param {*} req Request form sender
 * @param {*} res Answerable object.
 * @returns {void} Either errors if the request isn't allowed or the number of updated seed(s)
 */
SeedController.prototype.editSeed = function (req, res)  {
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
            if (modelsContainer[req.params.target][Object.keys(modelsContainer[req.params.target])[i]] !== null &&
                typeof req.body[Object.keys(modelsContainer[req.params.target])[i]] !== typeof modelsContainer[req.params.target][Object.keys(modelsContainer[req.params.target])[i]]) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }
            if (Object.keys(modelsContainer[req.params.target])[i] === 'id') {
                whereObj.id = req.body.id;
            } else {
                newEntry[Object.keys(modelsContainer[req.params.target])[i]] = req.body[Object.keys(modelsContainer[req.params.target])[i]];
            }
        }
        return updateEntry(mapKeyTable[req.params.target].table, req.user, '*', whereObj, newEntry).then((result) => {
            res.status(200).json(formatToJSon(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    } else if (!req.params.hasOwnProperty('target')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        return;
    }
};

/**
 * @function deleteEntry
 * @description Set as delete a seed
 * @param {*} req Request form sender
 * @param {*} res Answerable object.
 * @returns {void} Either errors if the request isn't allowed or the number of deleted seed(s)
 */
SeedController.prototype.deleteSeed = function (req, res)  {
    if (req.params.hasOwnProperty('target') && mapKeyTable.hasOwnProperty(req.params.target)) {
        let whereObj = {};
        if (req.user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        if (!req.body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof req.body.id !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        whereObj.id = req.body.id;
        return deleteEntry(mapKeyTable[req.params.target].table, req.user, whereObj).then((result) => {
            let promiseArr = [];
            for (let i = 0; i < mapKeyTable[req.params.target].referenced.length; i++) {
                promiseArr.push(deleteEntry(mapKeyTable[req.params.target].referenced[i].table, req.user, { [mapKeyTable[req.params.target].referenced[i].column]: req.body.id }));
            }
            return Promise.all(promiseArr).then((__unused__allResult) => {
                res.status(200).json(formatToJSon(result));
                return true;
            }).catch((allError) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, allError));
                return false;
            });
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        });
    } else if (!req.params.hasOwnProperty('target')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        return;
    }
};

/**
 * @function updateFiles
 * @desc Update the seeding files fron the newly modified table itself
 * @param {string} index The type of request linking the index in mapKeyTable
 */
SeedController.prototype.updateFiles = function (index)  {
    return getEntry(mapKeyTable[index].table, {}, '*').then((result) => {
        if (result !== null && result !== undefined && result.length !== 0) {
            writeJson(result, `${path}${mapKeyTable[index].file}`);
        } else {
            if (process.env.NODE_ENV !== 'production') {
                console.error(message.errorMessages.SEEDUPDATEERROR);
            }
        }
        return true;
    }).catch((error) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return false;
    });
};

module.exports = SeedController;