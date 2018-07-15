import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';

export const createTestAPICall = (body) => dispatch => {
    return apiHelper('/tests', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        });
};