import { addError } from './error';
import store from '../store';
import actionTypes from './listOfActions';
import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';

export const alterDataRequest = (body) => ({ type: actionTypes.data.ALTER_DATA_REQUEST, payload: body });
export const alterDataSuccess = (body) => ({ type: actionTypes.data.ALTER_DATA_SUCCESS, payload: body });
export const alterDataFailure = (body) => ({ type: actionTypes.data.ALTER_DATA_FAILURE, payload: body });

export const alterDataCall = (body, callback) => dispatch => apiHelper(`/data/${body.type}`, { method: 'POST', body: JSON.stringify(body.data) })
    .then(() => {
        if (typeof callback === 'function') {
            callback();
        }
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(err => {
        store.dispatch(addError({ error: err }))
    });