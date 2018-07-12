import { getPatientProfileById } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const createTestAPICall = (body) => dispatch => {
    console.log(body);
    return apiHelper('/tests', { method: 'POST', body: JSON.stringify(body.data) })
        .then(json => {
            dispatch(getPatientProfileById(body.patientId));
        })
}