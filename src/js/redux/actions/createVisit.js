import { getPatientProfileById } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const createVisitAPICall = (body) => dispatch => {
    return apiHelper('/visits', { method: 'POST', body: JSON.stringify(body.visitData) })
        .then(json => {
            body.VSData.patientId = json[0];
            return apiHelper('/data/visit', { method: 'POST', body: JSON.stringify(body.VSData) })
        })
        .then(json => {
            console.debug('VISIT cREATEED > ', json);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(res => res.text().then(msg => console.log(msg)));
};