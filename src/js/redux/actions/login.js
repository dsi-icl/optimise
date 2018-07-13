import actionTypes from './listOfActions.js';
import { apiHelper } from '../fetchHelper.js';

export const checkingLogin = () => ({ type: actionTypes.login.CHECKING_LOGIN });

export const loggedIn = body => ({ type: actionTypes.login.LOGGED_IN, payload: body });

export const notLoggedIn = () => ({ type: actionTypes.login.NOT_LOGGED_IN });

export const whoami = (body) => dispatch => {
    dispatch(checkingLogin());
    return apiHelper('/whoami')
        .then(json => {
            console.debug('LOGGEDIN > ', json);
            dispatch(loggedIn(json[0]));
        })
        .catch(() => { dispatch(notLoggedIn()); });
};

export const loginRequest = body => ({ type: actionTypes.login.LOGIN_REQUESTED, payload: body });

export const loginSuccess = (body) => ({ type: actionTypes.login.LOGIN_SUCCESS, payload: body });

export const loginFailure = () => ({ type: actionTypes.login.LOGIN_FAILURE });

export const loginAPICall = (body) => dispatch => {
    console.log('BODY > ', body);
    dispatch(loginRequest(body));
    return apiHelper('/users/login', { method: 'POST', body: JSON.stringify(body) })
        .then(json => {
            dispatch(loginSuccess(json));
        })
        .catch(err => { dispatch(loginFailure(err)); });
};
