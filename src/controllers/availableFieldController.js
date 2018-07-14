const knex = require('../utils/db-connection');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');

class AvailableFieldController {
    getFields(req, res) {     //bound to GETclinicalEvents and GETtestTypes too
        const tableMap = {
            'visitFields': 'AVAILABLE_FIELDS_VISITS',
            'testFields': 'AVAILABLE_FIELDS_TESTS',
            'ceFields': 'AVAILABLE_FIELDS_CE',
            'clinicalEvents': 'AVAILABLE_CLINICAL_EVENT_TYPES',
            'testTypes': 'AVAILABLE_TEST_TYPES',
            'diagnoses': 'AVAILABLE_DIAGNOSES'
        };
        let moduleObj = {};
        if (tableMap.hasOwnProperty(req.params.dataType)) {
            if (req.params.dataType === 'visitFields' && req.query.module) {
                moduleObj = { module: req.query.module };
            }
            let table = tableMap[req.params.dataType];
            knex(table)
                .select('*')
                .where(moduleObj).then(function (result) {
                    res.status(200).json(formatToJSON(result));
                    return;
                }, function (error) {
                    res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                    return;
                });
            return;
        }
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
    }
}

const _singleton = new AvailableFieldController();
module.exports = _singleton;