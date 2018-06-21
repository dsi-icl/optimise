import { getPatientProfileById } from './searchPatientById.js';
import actionTypes from './listOfActions.js';

const createVisitRequest = (body) => ({ type: actionTypes.visits.CREATE_VISIT_REQUEST, payload: body });
const createVisitSuccess = (json) => ({ type: actionTypes.visits.CREATE_VISIT_SUCCESS, payload: json });

export const createVisitAPICall = (body) => dispatch => fetch('/api/visits', {
    mode: 'cors',
    headers: { 'token': 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb', //change later
        'content-type': 'application/json' },  
    method: 'POST',
    body: JSON.stringify(body)
})
    .then(res => {
        if (res.status === 200) {
            res.text();
        } else {
            throw 'breaking the chain';
        }
    }, err => console.log(err))
    .then(text => {
        dispatch(getPatientProfileById(body.patientId));         //think about abortion later    //and think about not having to refresh the whole page
    })
    .catch(err => console.log(err))