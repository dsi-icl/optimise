import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const createCEAPICall = (body) => dispatch => {
    return apiHelper('/clinicalEvents', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(err => console.log(err));
};


export const deleteCEAPICall = (body) => dispatch => {
    return apiHelper('/clinicalEvents', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(err => console.log(err));
};

export const updateCECall = (body) => dispatch => {
    return apiHelper('/clinicalEvents', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        }).catch(err => console.log(err));;
};