import { addError } from './error';
import store from '../store';
import { createShadowVisitAPICall } from './createVisit';
import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const createTreatmentAPICall = (body) => dispatch => {
    return createShadowVisitAPICall(body.data.patientId, ({ visitId }) => apiHelper('/treatments', { method: 'POST', body: JSON.stringify(Object.assign(body.data, { visitId })) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => store.dispatch(addError({ error: err })))
    );
};

export const createTreatmentInterruptionAPICall = (body) => dispatch => {
    return apiHelper('/treatments/interrupt', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => store.dispatch(addError({ error: err })));
};

export const deleteTreatmentCall = (body) => dispatch => {
    return apiHelper('/treatments', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => store.dispatch(addError({ error: err })));
};

export const deleteTreatmentInterruptionAPICall = (body) => dispatch => {
    return apiHelper('/treatments/interrupt', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => store.dispatch(addError({ error: err })));
};

export const updateTreatmentCall = (body) => dispatch => {
    return apiHelper('/treatments', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => store.dispatch(addError({ error: err })));
};