import { addError } from './error';
import actionTypes from './listOfActions';
import { apiHelper } from '../fetchHelper';


export const getSyncOptionsSuccess = (options) => ({ type: actionTypes.syncOptions.GET_SYNC_OPTIONS_SUCCESS, payload: options });
export const setSyncOptionsSuccess = (options) => ({ type: actionTypes.syncOptions.SET_SYNC_OPTIONS_SUCCESS, payload: options });
export const syncTriggerSuccess = () => ({ type: actionTypes.syncOptions.SYNC_TRIGGER_SUCCESS, payload: {} });

export const setSyncOptionsAPICall = (body) => dispatch => apiHelper('/sync', { method: 'POST', body: JSON.stringify(body) })
    .then(() => {
        dispatch(setSyncOptionsSuccess(body));
    })
    .catch(msg => dispatch(addError({ error: msg })));

export const getSyncOptionsAPICall = () => dispatch => apiHelper('/sync', { method: 'GET' })
    .then(result => {
        dispatch(getSyncOptionsSuccess(result));
    })
    .catch(msg => dispatch(addError({ error: msg })));

export const syncNowAPICall = () => dispatch => apiHelper('/sync', { method: 'PUT' })
    .then(() => {
        dispatch(syncTriggerSuccess());
    })
    .catch(msg => dispatch(addError({ error: msg })));