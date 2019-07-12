import { addError } from './error';
import actionTypes from './listOfActions';
import { apiHelper } from '../fetchHelper';


export const getSyncOptionsSuccess = (options) => ({ type: actionTypes.syncInfo.GET_SYNC_OPTIONS_SUCCESS, payload: options });
export const setSyncOptionsSuccess = (options) => ({ type: actionTypes.syncInfo.SET_SYNC_OPTIONS_SUCCESS, payload: options });
export const getSyncStatusSuccess = (result) => ({ type: actionTypes.syncInfo.GET_SYNC_STATUS_SUCCESS, payload: result });
export const syncTriggerSuccess = (result) => ({ type: actionTypes.syncInfo.SYNC_TRIGGER_SUCCESS, payload: result });

export const setSyncOptionsAPICall = (body) => dispatch => apiHelper('/sync/options', { method: 'POST', body: JSON.stringify(body) })
    .then(() => {
        dispatch(setSyncOptionsSuccess(body));
    })
    .catch(msg => dispatch(addError({ error: msg })));

export const getSyncOptionsAPICall = () => dispatch => apiHelper('/sync/options', { method: 'GET' })
    .then(result => {
        dispatch(getSyncOptionsSuccess(result));
    })
    .catch(msg => dispatch(addError({ error: msg })));

export const getSyncStatusAPICall = () => dispatch => apiHelper('/sync/status', { method: 'GET' }, true)
    .then(result => {
        dispatch(getSyncStatusSuccess(result));
    })
    .catch(result => dispatch(dispatch(getSyncStatusSuccess(result))));

export const syncNowAPICall = () => dispatch => apiHelper('/sync', { method: 'PUT' }, true)
    .then(result => {
        dispatch(syncTriggerSuccess(result));
    })
    .catch(result => dispatch(dispatch(syncTriggerSuccess(result))));