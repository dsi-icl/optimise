import actionTypes from './listOfActions';
import { apiHelper } from '../fetchHelper';

export const checkingLogin = () => ({ type: actionTypes.login.CHECKING_LOGIN });

export const loggedIn = body => ({ type: actionTypes.login.LOGGED_IN, payload: body });

export const notLoggedIn = () => ({ type: actionTypes.login.NOT_LOGGED_IN });

export const whoami = () => dispatch => {
    dispatch(checkingLogin());
    return apiHelper('/whoami')
        .then(json => {
            dispatch(loggedIn(json));
        })
        .catch((err) => { console.log('ERROR', err); dispatch(notLoggedIn()); });
};

export const loginRequest = body => ({ type: actionTypes.login.LOGIN_REQUESTED, payload: body });

export const loginSuccess = (body) => ({ type: actionTypes.login.LOGIN_SUCCESS, payload: body });

export const loginFailure = () => ({ type: actionTypes.login.LOGIN_FAILURE });

export const loginAPICall = (body) => dispatch => {
    dispatch(loginRequest(body));
    return apiHelper('/users/login', { method: 'POST', body: JSON.stringify(body) })
        .then(json => {
            dispatch(loginSuccess(json));
        })
        .catch(err => { dispatch(loginFailure(err)); });
};


export const logoutRequest = () => ({ type: actionTypes.login.LOGOUT_REQUEST });

export const logoutAPICall = (body) => dispatch => {
    dispatch(logoutRequest(body));
    return apiHelper('/users/logout', { method: 'POST', body: JSON.stringify(body) })
        .catch(err => console.log(err));
};
