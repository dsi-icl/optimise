import { getPatientProfileById } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const createVisitAPICall = (body) => dispatch => {
    return apiHelper('/visits', { method: 'POST', body: JSON.stringify(body.visitData) })
        .then(json => {
            body.VSData.visitId = json.state;
            console.log(body.VSData);
            return apiHelper('/data/visit', { method: 'POST', body: JSON.stringify(body.VSData) })
        })
        .then(json => {
            console.debug('VISIT cREATEED > ', json);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg));
};