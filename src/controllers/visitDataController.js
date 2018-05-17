const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry, addFieldData} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class VisitDataController {
    addVisitData(req, res){
        addFieldData(req, res, 'available_fields_visits', 'visit_collected_data');
    }

    deleteVisitData(req, res){
        if (req.requester.priv === 1){
            deleteEntry(req, res, 'visit_collected_data', {visit: req.body.visit, field: req.body.field}, req.body.field, 1);
        }
    }
}

//treatment
//treatment data
//relapse
//relapse data
//test
//test data


module.exports = new VisitDataController();