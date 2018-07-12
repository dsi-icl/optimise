import actionTypes from './listOfActions.js';
import { apiHelper } from '../fetchHelper.js';

export const loginRequest = () => ({ type: actionTypes.login.LOGIN_REQUESTED });

export const loginSuccess = (body) => ({ type: actionTypes.login.LOGIN_SUCCESS, payload: body });

export const loginFailure = () => ({ type: actionTypes.login.LOGIN_FAILURE });

export const loginAPICall = (body) => dispatch => {
    dispatch(loginRequest());
    return apiHelper('/users/login', { method: 'POST', body: JSON.stringify(body) })
        .then(json => {
            dispatch(loginSuccess(json));
        })
        .catch(err => { dispatch(loginFailure(err)); });
};
