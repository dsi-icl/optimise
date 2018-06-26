const knex = require('../utils/db-connection');

class AvailableFieldController {
    getFields(req, res){     //bound to GETclinicalEvents and GETtestTypes too
        const tableMap = {
            'visitFields': 'AVAILABLE_FIELDS_VISITS',
            'testFields': 'AVAILABLE_FIELDS_TESTS',
            'clinicalEvents': 'AVAILABLE_CLINICAL_EVENT_TYPES',
            'testTypes': 'AVAILABLE_TEST_TYPES'
        };
        let moduleObj = {};
        if (tableMap.hasOwnProperty(req.params.dataType)) {
            if (req.params.dataType === 'visitFields' && req.query.module) {
                moduleObj = { module: req.query.module };
            }
            let table = tableMap[req.params.dataType];
            knex(table)
                .select('*')
                .where(moduleObj)
                .then(result => res.status(200).json(result))
                .catch(err => { console.log(err); res.status(500).send('database error'); });
            return ;
        }
        res.status(400).send('Unrecognized parameters');
    }
}

const _singleton = new AvailableFieldController();
module.exports = _singleton;