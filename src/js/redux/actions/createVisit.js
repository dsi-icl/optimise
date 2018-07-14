import { getPatientProfileById } from './searchPatientById';
import { apiHelper } from '../fetchHelper';

export const createVisitAPICall = (body) => dispatch => {
    return apiHelper('/visits', { method: 'POST', body: JSON.stringify(body.visitData) })
        .then(json => {
            body.VSData.visitId = json.state;
            return apiHelper('/data/visit', { method: 'POST', body: JSON.stringify(body.VSData) });
        })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg));
};