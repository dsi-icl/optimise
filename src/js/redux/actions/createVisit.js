import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const createVisitAPICall = (body) => dispatch => {
    return apiHelper('/visits', { method: 'POST', body: JSON.stringify(body.visitData) })
        .then(json => {
            body.VSData.visitId = json.state;
            return apiHelper('/data/visit', { method: 'POST', body: JSON.stringify(body.VSData) });
        })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg));
};

export const createShadowVisitAPICall = (body, context) => dispatch => {
    return apiHelper('/visits', { method: 'POST', body: JSON.stringify(body.visitData) })
        .then(json => {
            dispatch(getPatientProfileById(body.patientId));
            history.push(`${context.to}/${json.state}/${context.type}`);
        })
        .catch(msg => console.log(msg));
};