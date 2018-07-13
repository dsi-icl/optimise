import actionTypes from './listOfActions.js';
import { apiHelper } from '../fetchHelper.js';

export const checkingLogin = () => ({ type: actionTypes.login.CHECKING_LOGIN });

export const loggedIn = () => ({ type: actionTypes.login.LOGGED_IN });

export const notLoggedIn = () => ({ type: actionTypes.login.NOT_LOGGED_IN });

export const whoami = (body) => dispatch => {
    dispatch(checkingLogin());
    return apiHelper('/whoami')
        .then(() => {
            dispatch(loggedIn());
        })
        .catch(() => { dispatch(notLoggedIn()); });
};

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
