import { getPatientProfileById } from './searchPatientById.js';
import actionTypes from './listOfActions.js';
import { promises } from 'fs';

const createVisitRequest = (body) => ({ type: actionTypes.visits.CREATE_VISIT_REQUEST, payload: body });
const createVisitSuccess = (json) => ({ type: actionTypes.visits.CREATE_VISIT_SUCCESS, payload: json });

export const createVisitAPICall = (body) => dispatch => {
    console.log(body);
    return fetch('/visits', {
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
                return res.text;
            } else {
                return Promise.reject(res);
            }
        }, err => console.log(err))
        .then(text => {
            dispatch(getPatientProfileById(body.patientId));         //think about abortion later    //and think about not having to refresh the whole page
        })
        .catch(msg => console.log(msg))
}