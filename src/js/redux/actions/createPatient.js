import actionTypes from './listOfActions.js';
import { getPatientProfileById } from './searchPatientById.js';

export const createPatientRequest = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_REQUEST, payload: patientId });
export const createPatientSuccess = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_SUCCESS, payload: patientId });
export const createPatientCall = (patientId) => dispatch => {
    dispatch(createPatientRequest(patientId));
    return fetch('/api/patients', {
        method: 'POST',
        mode: 'cors',
        headers: { 'content-type': 'application/json',
            'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a' },   //change later
        body: JSON.stringify({ 'aliasId': patientId, 'study': 'optimise' })
    })
        .then(res => res.json(), err => console.log(err))
        .then(json => {
            console.log(json);
            dispatch(getPatientProfileById(patientId));
        })
}