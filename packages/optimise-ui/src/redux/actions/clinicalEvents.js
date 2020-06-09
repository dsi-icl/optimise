import { addError } from './error';
import store from '../store';
import { createShadowVisitAPICall } from './createVisit';
import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const createCEAPICall = (body) => dispatch => createShadowVisitAPICall(body.data.patientId, ({ visitId }) => apiHelper('/clinicalEvents', { method: 'POST', body: JSON.stringify(Object.assign(body.data, { visitId })) })
    .then((res) => {
        const ceId = res.state;
        history.push(body.toFormat(ceId));
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(err => store.dispatch(addError({ error: err })))
);

export const deleteCEAPICall = (body) => dispatch => apiHelper('/clinicalEvents', { method: 'DELETE', body: JSON.stringify(body.data) })
    .then(() => {
        history.push(body.to);
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(err => store.dispatch(addError({ error: err })));

export const updateCECall = (body) => dispatch => apiHelper('/clinicalEvents', { method: 'PUT', body: JSON.stringify(body.data) })
    .then(() => {
        history.push(body.to);
        dispatch(getPatientProfileById(body.patientId));
    }).catch(err => store.dispatch(addError({ error: err })));