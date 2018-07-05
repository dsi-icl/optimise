import actionTypes from './listOfActions.js';


export const loginRequest = () => ({ type: actionTypes.login.LOGIN_REQUESTED });

export const loginSuccess = (body) => ({ type: actionTypes.login.LOGIN_SUCCESS, payload: body });

export const loginFailure = () => ({ type: actionTypes.login.LOGIN_FAILURE })

export const loginAPICall = (body) => dispatch => {
    dispatch(loginRequest());
    return fetch('/internalapi/userlogin', {
        mode: 'cors',
        headers: { 'content-type': 'application/json' },  
        method: 'POST',
        body: JSON.stringify(body)
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return Promise.reject(res);
            }
        }, err => console.log(err))
        .then(json => {
            dispatch(loginSuccess(json));         //think about abortion later    //and think about not having to refresh the whole page
        })
        .catch(err => { console.log(err); dispatch(loginFailure()) }) }
