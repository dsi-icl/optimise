const {isEmptyObject} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class PatientController {
    constructor(){
        this._Router = this._Router.bind(this);
    }

    _Router(req, res){
        try {
            this[`${req.method}`](req, res);
        } catch(e) {
            if (e instanceof TypeError){
                res.status(400).send(`Bad request. Cannot ${req.method} this API endpoint!`);
            } else {
                res.status(500).send('Server Error!');
            }
        }
    }

    GET(req, res){  //get all list of patient if no query string; get similar if querystring is provided
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

    POST(req, res){   //createPatient
        let entryObj = {alias_id: req.body.alias_id,
                        study: req.body.study};
        let databaseErrMsg = 'Cannot create patient. ID might already exist. Also, make sure you provide "alias_id" and "study" as keys.';
        createEntry(req, res, 'patients', entryObj, databaseErrMsg);
    }

    DELETE(req, res){ //setPatientAsDeleted
        if (req.requester.priv === 1) {
            deleteEntry(req, res, 'patients', {'alias_id': req.body.alias_id}, req.body.alias_id, 1);
        } else {
            res.status(403).send('Sorry! Only admins are able to edit / delete data');
        }
    }
    
    getPatientProfileById(req, res){
        knex('patients')
            .select({patientId:'patients.id'}, 'patients.alias_id', 'patients.study', 'patient_demographic_data.DOB', 'patient_demographic_data.gender')
            .leftOuterJoin('patient_demographic_data', 'patients.id', 'patient_demographic_data.patient')
            .where({"patients.alias_id": req.params.patientId, "patients.deleted": 0})
            .then(result => {
                res.status(200).json(result);});
    }
}

const _singleton = new PatientController();
module.exports = _singleton;