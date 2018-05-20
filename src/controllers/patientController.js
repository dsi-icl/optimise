const chalk = require('chalk');
const {isEmptyObject} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const SelectorUtils = require('../utils/selector-utils');
const knex = require('../utils/db-connection');

class PatientController {
    searchPatients(req, res){  //get all list of patient if no query string; get similar if querystring is provided
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

    createPatient(req, res){
        let entryObj = {alias_id: req.body.alias_id,
                        study: req.body.study};
        let databaseErrMsg = 'Cannot create patient. ID might already exist. Also, make sure you provide "alias_id" and "study" as keys.';
        createEntry(req, res, 'patients', entryObj, databaseErrMsg);
    }

    setPatientAsDeleted(req, res){
        if (req.requester.priv === 1) {
            deleteEntry(req, res, 'patients', {'alias_id': req.body.alias_id}, req.body.alias_id, 1);
        } else {
            res.status(403).send('Sorry! Only admins are able to edit / delete data');
        }
    }
    
    getPatientProfileById(req, res){
        knex('patients')
            .select({patientId: 'id', study: 'study'})
            .where({'alias_id': req.params.patientId, deleted: 0})
            .then(patientResult => {                               //id = patientResult.patientId
                if (patientResult.length === 1) {
                    const patientId = patientResult[0].patientId;
                    return patientId
                } else {
                    res.status(404).send('cannot find your patient');
                    throw 'stopping the chain';
                }})
            .then(patientId => {
                if (req.query.getOnly && typeof(req.query.getOnly) === 'string'){
                    const getOnlyArr = req.query.getOnly.split(',');
                    const promiseArr = [];
                    for (let i = 0; i < getOnlyArr.length; i++){
                        try {
                            promiseArr.push(SelectorUtils[`get${getOnlyArr[i]}`](patientId));
                        } catch (e) {
                            res.status(400).send('something in your ?getOnly is not permitted!');
                            return
                        }
                    }
                    return Promise.all(promiseArr);  //.then(result => {return result}); why no need?
                } else if (req.query.getOnly) {
                    res.status(400).send('please format your ?getOnly with fields separated by commas');
                    throw 'stopping the chain';
                } else {
                    //get everythign
                }})
            .then(
                result => {
                    const responseObj = {};
                    responseObj.patientId = req.params.patientId;
                    for (let i = 0; i < result.length; i++){
                        responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
                    }
                    res.status(200).send(responseObj);
                })
            .catch(err => console.log(err));
    }

}




const _singleton = new PatientController();
module.exports = _singleton;

//a patient's profile contains his demographicData, immunisation, visits, visitData, Tests, testData, clinicalEvents, clinicalEventData, treatments, treatmentData