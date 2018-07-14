import { getPatientProfileById } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const updateConsentAPICall = (body) => dispatch => {
    return apiHelper('/patients', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg));
};