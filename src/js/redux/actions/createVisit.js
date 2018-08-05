import moment from 'moment';
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
            history.push(`${body.to}/data/visit/${body.VSData.visitId}/vitals#visit/${body.VSData.visitId}`);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.error(msg));
};

export const createShadowVisitAPICall = (patientId, callback) => {
    return apiHelper('/visits', {
        method: 'POST',
        body: JSON.stringify({
            patientId: patientId,
            visitDate: moment().toISOString(),
            type: 2
        })
    })
        .then(json => callback({ visitId: json.state }))
        .catch(msg => console.error(msg));
};


export const updateVisitAPICall = (body) => dispatch => {
    return apiHelper('/visits', { method: 'PUT', body: JSON.stringify(body.visitData) })
        .then(() => {
            return apiHelper(`/data/${body.type}`, { method: 'POST', body: JSON.stringify(body.VSData) });
        })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.error(msg));
};