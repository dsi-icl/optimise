import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';

export const createCEAPICall = (body) => dispatch => {
    return apiHelper('/clinicalEvents', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(err => console.log(err));
};