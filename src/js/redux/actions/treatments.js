import { getPatientProfileById } from './searchPatientById';
import { apiHelper } from '../fetchHelper';

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