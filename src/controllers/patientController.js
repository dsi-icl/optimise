const {isEmptyObject} = require('../utils/basic-utils');

const knex = require('../utils/db-connection');

class PatientController {
    static searchPatientsById(req, res){
        let queryid;
        if (isEmptyObject(req.query)) {
          queryid = '';
        } else if (Object.keys(req.query).length === 1 && typeof(req.query.id) === 'string') {
          queryid = req.query.id;
        } else {
          res.status(400);
          res.send('The query string can only have one parameter "id"');
          return
        }
        queryid = 'patients.alias_id LIKE "%' + queryid + '%"';
        knex('patients')
          .select({patientId:'patients.id'}, 'patients.alias_id', 'patients.study', 'patient_demographic_data.DOB', 'patient_demographic_data.gender')
          .leftOuterJoin('patient_demographic_data', 'patients.id', 'patient_demographic_data.patient')
          .whereRaw(queryid)
          .then(result => {
            res.status(200);
            res.json(result);
        });
    }

    static getPatientById(req, res){
        knex('patients')
          .select({patientId:'patients.id'}, 'patients.alias_id', 'patients.study', 'patient_demographic_data.DOB', 'patient_demographic_data.gender')
          .leftOuterJoin('patient_demographic_data', 'patients.id', 'patient_demographic_data.patient')
          .whereRaw("patients.alias_id IS '" +  req.params.patientID + "'")
          .then(result => {
            res.status(200);
            res.json(result);
        });
    }
}


module.exports = PatientController;