const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class AvailableFieldController {
    getFields(req, res){     //bound to GETclinicalEvents and GETtestTypes too
        const tableMap = {
            'visitFields':'available_fields_visits',
            'testFields':'available_fields_tests',
            'clinicalEvents':'available_clinical_event_types',
            'testTypes':'available_test_types'
        }
        let moduleObj = {};
        if (tableMap.contains(rea.params.dataType)) {
            if (req.params.dataType === 'visitFields' && req.query.module) {
                moduleObj = {module: req.query.module};
            }
            let table = tableMap[req.params.dataType];
            knex(table)
                .select('*')
                .where(moduleObj)
                .then(result => res.status(200).json(result))
                .catch(err => {console.log(err); res.status(500).send('database error')});
            return ;
        }
        res.status(400).send('Unrecognized parameters');
    }
}

const _singleton = new AvailableFieldController();
module.exports = _singleton;