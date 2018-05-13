const {isEmptyObject} = require('../utils/basic-utils');
const {createEntry, deleteEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class PatientController {
    static searchPatientsById(req, res){
        let queryid;
        if (isEmptyObject(req.query)) {
            queryid = '';
        } else if (Object.keys(req.query).length === 1 && typeof(req.query.id) === 'string') {
            queryid = req.query.id;
        } else {
            res.status(400).send('The query string can only have one parameter "id"');
            return
        }
        queryid = '%' + queryid + '%';
        knex('patients')
            .select({patientId:'patients.id'}, 'patients.alias_id', 'patients.study', 'patient_demographic_data.DOB', 'patient_demographic_data.gender')
            .leftOuterJoin('patient_demographic_data', 'patients.id', 'patient_demographic_data.patient')
            .where('patients.alias_id', 'like', queryid)
            .andWhere('patients.deleted', 0)
            .then(result => {
                res.status(200).json(result);
            });
    }

    static getPatientById(req, res){
        knex('patients')
            .select({patientId:'patients.id'}, 'patients.alias_id', 'patients.study', 'patient_demographic_data.DOB', 'patient_demographic_data.gender')
            .leftOuterJoin('patient_demographic_data', 'patients.id', 'patient_demographic_data.patient')
            .where({"patients.alias_id": req.params.patientID, "patients.deleted": 0})
            .then(result => {
                res.status(200).json(result);});
    }

    static createPatient(req, res){
        let entryObj = {alias_id: req.body.alias_id,
                        study: req.body.study,
                        created_by_user: req.requester.userid};
        let databaseErrMsg = 'Cannot create patient. ID might already exist. Also, make sure you provide "alias_id" and "study" as keys.';
        createEntry(req, res, 'patients', entryObj, databaseErrMsg);
    }

    static setPatientAsDeleted(req, res){
        if (req.requester.priv === 1) {
            deleteEntry(req, res, 'patients', {'alias_id': req.body.alias_id}, req.body.alias_id, 1);
        } else {
            res.status(403).send('Sorry! Only admins are able to edit / delete data');
        }
    }
}


module.exports = PatientController;