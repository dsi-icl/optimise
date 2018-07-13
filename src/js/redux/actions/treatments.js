import { getPatientProfileById } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const createTreatmentAPICall = (body) => dispatch => {
    return apiHelper('/treatments', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        });
};


export const createTreatmentInterruptionAPICall = (body) => dispatch => {
    return apiHelper('/treatments/interrupt', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        });
};