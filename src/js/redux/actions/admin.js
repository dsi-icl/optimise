import actionTypes from './listOfActions.js';
import { apiHelper } from '../fetchHelper.js';


export const getLogRequest = payload => ({ type: actionTypes.admin.GET_LOG_REQUEST, payload: payload });
export const getLogSuccess = payload => ({ type: actionTypes.admin.GET_LOG_SUCCESS, payload: payload });
export const getLogFailure = payload => ({ type: actionTypes.admin.GET_LOG_FAILURE, payload: payload });


export const getLogAPICall = () => dispatch => {
    return apiHelper('/logs')
        .then(json => {
            dispatch(getLogSuccess(json));
        })
        .catch(msg => { console.log(msg); getLogFailure(); });
};


export const getAllUsersRequest = payload => ({ type: actionTypes.admin.GET_ALL_USERS_REQUEST, payload: payload });
export const getAllUsersSuccess = payload => ({ type: actionTypes.admin.GET_ALL_USERS_SUCCESS, payload: payload });
export const getAllUsersFailure = payload => ({ type: actionTypes.admin.GET_ALL_USERS_FAILURE, payload: payload });

export const getAllUsersAPICall = () => dispatch => {
    return apiHelper('/users?username=')
        .then(json => {
            dispatch(getAllUsersSuccess(json));
        })
        .catch(msg => { console.log(msg); getAllUsersFailure(); });
};


export const createUserSuccess = payload => ({ type: actionTypes.admin.GET_ALL_USERS_SUCCESS, payload: payload });


export const createUserAPICall = body => dispatch => {
    return apiHelper('/users', { method: 'POST', body: JSON.stringify(body)})
        .then(() => {
            dispatch(getAllUsersAPICall());
        })
        .catch(msg => console.log(msg));
};