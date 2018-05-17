const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry, addFieldData} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class VisitDataController {
    addVisitData(req, res){
        addFieldData(req, res, 'available_fields_visits', 'visit_collected_data');
    }
}

module.exports = new VisitDataController();