import { addError } from './error';
import store from '../store';
import actionTypes from './listOfActions';
import { apiHelper } from '../fetchHelper';
import { getMeddraCall } from './availableFields';

export const getLogRequest = payload => ({ type: actionTypes.admin.GET_LOG_REQUEST, payload: payload });
export const getLogSuccess = payload => ({ type: actionTypes.admin.GET_LOG_SUCCESS, payload: payload });
export const getLogFailure = payload => ({ type: actionTypes.admin.GET_LOG_FAILURE, payload: payload });

export const getLogAPICall = (body = {}) => dispatch => {
    let url = '/logs';
    if (body.limit !== undefined && body.offset !== undefined)
        url += `?limit=${body.limit}&offset=${body.offset}`;
    return apiHelper(url)
        .then(json => {
            dispatch(getLogSuccess({
                body,
                json
            }));
        })
        .catch(msg => { store.dispatch(addError({ error: msg })); getLogFailure(); });
};


export const getAllUsersRequest = payload => ({ type: actionTypes.admin.GET_ALL_USERS_REQUEST, payload: payload });
export const getAllUsersSuccess = payload => ({ type: actionTypes.admin.GET_ALL_USERS_SUCCESS, payload: payload });
export const getAllUsersFailure = payload => ({ type: actionTypes.admin.GET_ALL_USERS_FAILURE, payload: payload });

export const getAllUsersAPICall = () => dispatch => apiHelper('/users?username=')
    .then(json => {
        dispatch(getAllUsersSuccess(json));
    })
    .catch(msg => { store.dispatch(addError({ error: msg })); getAllUsersFailure(); });


export const createUserSuccess = payload => ({ type: actionTypes.admin.GET_ALL_USERS_SUCCESS, payload: payload });

export const createUserAPICall = body => dispatch => apiHelper('/users', { method: 'POST', body: JSON.stringify(body) })
    .then(() => {
        dispatch(getAllUsersAPICall());
    })
    .catch(msg => store.dispatch(addError({ error: msg })));

export const deleteUserAPICall = body => dispatch => apiHelper('/users', { method: 'DELETE', body: JSON.stringify(body) })
    .then(dispatch(getAllUsersAPICall()))
    .catch(msg => store.dispatch(addError({ error: msg })));

export const changeEmailAPICall = body => () => apiHelper('/users', { method: 'PUT', body: JSON.stringify(body) })
    .catch(msg => store.dispatch(addError({ error: msg })));

export const changePasswordAPICall = body => () => apiHelper('/users', { method: 'PUT', body: JSON.stringify(body) })
    .catch(msg => store.dispatch(addError({ error: msg })));

export const changePrivAPICall = body => dispatch => apiHelper('/users', { method: 'PATCH', body: JSON.stringify(body) })
    .then(dispatch(getAllUsersAPICall()))
    .catch(msg => store.dispatch(addError({ error: msg })));


export const uploadMeddraRequest = payload => ({ type: actionTypes.admin.UPLOAD_MEDDRA_REQUEST, payload: payload });
export const uploadMeddraSuccess = payload => ({ type: actionTypes.admin.UPLOAD_MEDDRA_SUCCESS, payload: payload });
export const uploadMeddraFailure = payload => ({ type: actionTypes.admin.UPLOAD_MEDDRA_FAILURE, payload: payload });
export const uploadMeddraAPICall = form => dispatch => {
    dispatch(uploadMeddraRequest());
    return apiHelper('/uploadMeddra', {
        method: 'POST',
        body: form,
        headers: {
            accept: 'application/json'
        }
    }).then(() => {
        dispatch(uploadMeddraSuccess());
        dispatch(getMeddraCall());
    }).catch(msg => { store.dispatch(uploadMeddraFailure(msg)); });
};