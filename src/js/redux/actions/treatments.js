import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const createTreatmentAPICall = (body) => dispatch => {
    return apiHelper('/treatments', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => console.log(err));;
};

export const createTreatmentInterruptionAPICall = (body) => dispatch => {
    return apiHelper('/treatments/interrupt', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => console.log(err));;
};

export const deleteTreatmentCall = (body) => dispatch => {
    return apiHelper('/treatments', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => console.log(err));;
};

export const updateTreatmentCall = (body) => dispatch => {
    return apiHelper('/treatments', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => console.log(err));;
};