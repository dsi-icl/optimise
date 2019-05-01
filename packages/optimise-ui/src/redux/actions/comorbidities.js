import { addError } from './error';
import store from '../store';
import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';

export const createComorbidityAPICall = (body) => dispatch => apiHelper('/comorbidities', { method: 'POST', body: JSON.stringify(body.data) })
    .then(() => {
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(err => store.dispatch(addError({ error: err })));

export const deleteComorbidityAPICall = (body) => dispatch => apiHelper('/comorbidities', { method: 'DELETE', body: JSON.stringify(body.data) })
    .then(() => {
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(err => store.dispatch(addError({ error: err })));