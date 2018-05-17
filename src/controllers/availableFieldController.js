const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class AvailableFieldController {
    getFields(req, res){     //bound to GETclinicalEvents and GETtestTypes too
        let moduleObj = {};
        if (req.params.dataType === 'visitFields' && req.query.module) {
            moduleObj = {module: req.query.module};
        }
        let table;
        switch (req.params.dataType) {
            case 'visitFields':
                table = 'available_fields_visits';
                break
            case 'testFields':
                table = 'available_fields_tests';
                break
            case 'clinicalEvents':
                table = 'available_clinical_event_types';
                break
            case 'testTypes':
                table = 'available_test_types';
                break
        }
        knex(table)
            .select('*')
            .where(moduleObj)
            .then(result => res.status(200).json(result))
            .catch(err => {console.log(err); res.status(500).send('database error')});
    }

}

const _singleton = new AvailableFieldController();
module.exports = _singleton;