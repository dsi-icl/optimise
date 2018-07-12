import { getPatientProfileById } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const createTestAPICall = (body) => dispatch => {
    return apiHelper('/tests', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        });
};