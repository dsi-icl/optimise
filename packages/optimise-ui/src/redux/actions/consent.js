import { addError } from './error';
import store from '../store';
import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';

export const updateConsentAPICall = (body) => dispatch => apiHelper('/patients', { method: 'PUT', body: JSON.stringify(body.data) })
    .then(() => {
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(msg => store.dispatch(addError({ error: msg })));

export const updateParticipationAPICall = (body) => dispatch => apiHelper('/patients', { method: 'PUT', body: JSON.stringify(body.data) })
    .then(() => {
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(msg => store.dispatch(addError({ error: msg })));