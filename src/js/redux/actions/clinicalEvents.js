import { getPatientProfileById } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const createCEAPICall = (body) => dispatch => {
    return apiHelper('/clinicalEvents', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            console.debug('CE API CALL > ', body.patientId);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(err => console.log(err));
};