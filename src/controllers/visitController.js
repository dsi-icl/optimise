const {isEmptyObject} = require('../utils/basic-utils');
const knex = require('../utils/db-connection');

class VisitController {
    static getVisitsOfPatient(req, res){
        if (!isEmptyObject(req.query) && Object.keys(req.query).length === 1 && typeof(req.query.patientid) === 'string') {
            let queryid = 'patients.id IS "' + req.query.patientid + '"';
            knex('patients')
                .select({patientId:'patients.id'}, 'patients.alias_id', {visitId: 'visits.id'}, 'visits.visit_date')
                .leftOuterJoin('visits', 'patients.id', 'visits.patient')
                .whereRaw(queryid)
                .then(result => res.stauts(200).json(result))
        } else {
            res.status(400).send('The query string must have one and only one parameter "id"');
        }
    }
}

module.exports = VisitController;