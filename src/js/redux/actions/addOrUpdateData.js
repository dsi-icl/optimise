import actionTypes from './listOfActions.js';
import { getPatientProfileById } from './searchPatientById.js';


export const alterDataRequest = (body) => ({ type: actionTypes.data.ALTER_DATA_REQUEST, payload: body });
export const alterDataSuccess = (body) => ({ type: actionTypes.data.ALTER_DATA_SUCCESS, payload: body });
export const alterDataFailure = (body) => ({ type: actionTypes.data.ALTER_DATA_FAILURE, payload: body });


export const alterDataCall = (body) => dispatch => fetch(`/data/${body.type}`, {
    mode: 'cors',
    headers: {
        'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a', //change later
        'content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body.data)
})
    .then(res => {
        if (res.status === 200) {
            res.text();
        } else {
            throw new Error('breaking the chain');
        }
    }, err => console.log(err))
    .then(text => {
        dispatch(getPatientProfileById(body.patientId));         //think about abortion later    //and think about not having to refresh the whole page
    })
    .catch(err => console.log(err))