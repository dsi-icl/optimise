import { addError } from './error';
import store from '../store';
import { createShadowVisitAPICall } from './createVisit';
import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const createTestAPICall = (body) => dispatch => createShadowVisitAPICall(body.data.patientId, ({ visitId }) => apiHelper('/tests', { method: 'POST', body: JSON.stringify(Object.assign(body.data, { visitId })) })
    .then((res) => {
        const testId = res.state;
        history.push(body.toFormat(testId));
        dispatch(getPatientProfileById(body.patientId));
    }).catch(err => store.dispatch(addError({ error: err })))
);

export const deleteTestAPICall = (body) => dispatch => apiHelper('/tests', { method: 'DELETE', body: JSON.stringify(body.data) })
    .then(() => {
        history.push(body.to);
        dispatch(getPatientProfileById(body.patientId));
    }).catch(err => store.dispatch(addError({ error: err })));

export const updateTestCall = (body) => dispatch => apiHelper('/tests', { method: 'PUT', body: JSON.stringify(body.data) })
    .then(() => {
        history.push(body.to);
        dispatch(getPatientProfileById(body.patientId));
    }).catch(err => store.dispatch(addError({ error: err })));