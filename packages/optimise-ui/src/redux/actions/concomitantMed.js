import { addError } from './error';
import store from '../store';
import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';

export const createConcomitantMedAPICall = (body) => dispatch => apiHelper('/concomitantMeds', { method: 'POST', body: JSON.stringify(body.data) })
    .then(() => {
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(err => store.dispatch(addError({ error: err })));

export const editConcomitantMedAPICall = (body) => dispatch => apiHelper('/concomitantMeds', { method: 'PUT', body: JSON.stringify(body.data) })
    .then(() => {
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(err => store.dispatch(addError({ error: err })));

export const deleteConcomitantMedAPICall = (body) => dispatch => apiHelper('/concomitantMeds', { method: 'DELETE', body: JSON.stringify(body.data) })
    .then(() => {
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(err => store.dispatch(addError({ error: err })));