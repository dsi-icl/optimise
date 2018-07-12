import { getPatientProfileById } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const createImmunisationAPICall = (body) => dispatch => (
    apiHelper('/demographics/Immunisation', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg))
);