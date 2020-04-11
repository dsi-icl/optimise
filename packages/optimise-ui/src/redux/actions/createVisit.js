import { addError } from './error';
import store from '../store';
import moment from 'moment';
import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const createVisitAPICall = (body) => dispatch => apiHelper('/visits', { method: 'POST', body: JSON.stringify(body.visitData) })
    .then(json => {
        body.VSData.visitId = json.state;
        return apiHelper('/data/visit', { method: 'POST', body: JSON.stringify(body.VSData) });
    })
    .then(() => {
        // history.push(`${body.to}/data/visit/${body.VSData.visitId}/vitals#visit-${body.VSData.visitId}`);
        history.push(`${body.to}/visitFrontPage/${body.VSData.visitId}/page/0`);
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(msg => store.dispatch(addError({ error: msg })));

export const createShadowVisitAPICall = (patientId, callback) => apiHelper('/visits', {
    method: 'POST',
    body: JSON.stringify({
        patientId: patientId,
        visitDate: moment().toISOString(),
        type: 2
    })
})
    .then(json => callback({ visitId: json.state }))
    .catch(msg => store.dispatch(addError({ error: msg })));


export const updateVisitAPICall = (body) => dispatch => apiHelper('/visits', { method: 'PUT', body: JSON.stringify(body.visitData) })
    .then(() => {
        if (body.VSData)
            return apiHelper(`/data/${body.type}`, { method: 'POST', body: JSON.stringify(body.VSData) });
        return true;
    })
    .then(() => {
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(msg => store.dispatch(addError({ error: msg })));

export const deleteVisitAPICall = (body) => dispatch => apiHelper('/visits', { method: 'DELETE', body: JSON.stringify(body.data) })
    .then(() => {
        history.push(body.to);
        dispatch(getPatientProfileById(body.patientId));
    }).catch(err => store.dispatch(addError({ error: err })));