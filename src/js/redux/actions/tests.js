import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const createTestAPICall = (body) => dispatch => {
    return apiHelper('/tests', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        });
};


export const deleteTestAPICall = (body) => dispatch => {
    return apiHelper('/tests', { method: 'PATCH', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        });
};