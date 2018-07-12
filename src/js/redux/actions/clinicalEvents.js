import { getPatientProfileById } from './searchPatientById.js';
import actionTypes from './listOfActions.js';
import { apiHelper } from '../fetchHelper.js';

export const createCEAPICall = (body) => dispatch => {
    console.log(body);
    return apiHelper('/clinicalEvents', { method: 'POST', body: JSON.stringify(body.data) })
        .then(json => {
            dispatch(getPatientProfileById(body.patientId));
        })
}