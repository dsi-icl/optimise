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
        knex('patients')
            .insert({
                alias_id: req.body.alias_id,
                study: req.body.study,
                created_by_user: req.priv.userid,
                deleted: 0})
            .then(result => {
                res.json(200, result);})
            .catch(err => {
                console.log(err);
                res.status(400).send('Cannot create patient. ID might already exist. Also, make sure you provide "alias_id" and "study" as keys.');
            })

    }

    static setPatientAsDeleted(req, res){
        if (req.priv.priv === 1) {
            const date = new Date();
            knex('patients')
                .where({'alias_id': req.body.alias_id, 'deleted': 0})
                .update({
                    deleted: req.priv.userid + '@' + JSON.stringify(date) })
                .then(result => {
                    switch (result){
                        case 0:
                            res.status(401);
                            res.json('ID does not exist');
                            break
                        case 1:
                            res.status(200);
                            res.send(req.body.alias_id + ' has been deleted successfully.');
                            break
                        default:
                            res.status(500);
                            res.send('something weird happened');
                            break
                    }})
                .catch(err => {
                    console.log(err);
                    res.status(400).send('Database error');
                })
        } else {
            res.status(403).send('Sorry! Only admins are able to edit / delete data');
        }
    }
}


module.exports = PatientController;