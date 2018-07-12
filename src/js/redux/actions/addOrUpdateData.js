import actionTypes from './listOfActions.js';
import { getPatientProfileById } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const alterDataRequest = (body) => ({ type: actionTypes.data.ALTER_DATA_REQUEST, payload: body });
export const alterDataSuccess = (body) => ({ type: actionTypes.data.ALTER_DATA_SUCCESS, payload: body });
export const alterDataFailure = (body) => ({ type: actionTypes.data.ALTER_DATA_FAILURE, payload: body });


export const alterDataCall = (body) => dispatch => apiHelper(`/data/${body.type}`, { method: 'POST', body: JSON.stringify(body.data) })
    .then(() => {
        dispatch(getPatientProfileById(body.patientId));
    })
    .catch(err => console.log(err));