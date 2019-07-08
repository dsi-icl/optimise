import { addError } from './error';
import store from '../store';
// import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';

export const saveSyncOptionsAPICall = (body) => dispatch => apiHelper('/sync', { method: 'POST', body: JSON.stringify(body.data) })
    .then(() => {
        // dispatch(getPatientProfileById(body.patientId));
    })
    .catch(msg => store.dispatch(addError({ error: msg })));