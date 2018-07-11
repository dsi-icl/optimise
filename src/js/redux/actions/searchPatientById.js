import actionTypes from './listOfActions.js';
import { promises } from 'fs';

export const searchPatientsByIdRequest = searchString => ({ type: actionTypes.searchPatientById.SEARCH_PATIENTS_BY_ID_REQUEST, payload: searchString });
export const searchPatientsByIdFailure = patientId => ({ type: actionTypes.searchPatientById.SEARCH_RESULT_BY_ID_FAILURE, payload: patientId });
export const searchResultByIdSuccess = data => ({ type: actionTypes.searchPatientById.SEARCH_RESULT_BY_ID_SUCCESS, payload: data });

export const getPatientProfileById = (searchString) => dispatch => {
    dispatch(searchPatientsByIdRequest(searchString));
    return fetch(`/patients/${searchString}`, {
        mode: 'cors',
        headers: { 'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a' }   //change later
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                dispatch(searchPatientsByIdFailure(searchString));
                return Promise.reject('404');
            }
        }, err => console.log(err))
        .then(json => {
            console.log(json);
            dispatch(searchResultByIdSuccess(json))
        })
}