import actionTypes from './listOfActions.js';
import { getPatientProfileById, searchPatientsByIdRequest } from './searchPatientById.js';

export const createPatientRequest = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_REQUEST, payload: patientId });
export const createPatientSuccess = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_SUCCESS, payload: patientId });
export const createPatientCall = (body) => dispatch => fetch('/patients', {
    method: 'POST',
    mode: 'cors',
    headers: {
        'content-type': 'application/json',
        'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a'
    },   //change later
    body: JSON.stringify(body.patientData)
})
    .then(res => { dispatch(searchPatientsByIdRequest()); res.json() }, err => console.log(err))
    .then(json => {
        const patientId = json[0];
        const demoData = { ...body.demoData, patient: patientId };
        console.log(demoData);
        return fetch('/demographics/Demographic', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',
                'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a'
            },   //change later
            body: JSON.stringify(demoData)
        });
    })
    .then(res => res.json(), err => console.log(err))
    .then(json => { console.log(json); dispatch(getPatientProfileById(body.patientId)) })

//unfinished