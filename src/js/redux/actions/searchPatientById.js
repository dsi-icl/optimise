import actionTypes from './listOfActions.js';
import { apiHelper } from '../fetchHelper.js';

export const getPatientProfileByIdRequest = searchString => ({ type: actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_REQUEST, payload: searchString });
export const getPatientProfileByIdFailure = patientId => ({ type: actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_FAILURE, payload: patientId });
export const getPatientProfileByIdSuccess = data => ({ type: actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_SUCCESS, payload: data });


export const getPatientProfileById = (searchString) => dispatch => {
    dispatch(getPatientProfileByIdRequest(searchString));
    return apiHelper(`/patients/${searchString}`)
        .then(json => {
            console.log(json);
            dispatch(getPatientProfileByIdSuccess(json))
        })
        .catch(err => { dispatch(getPatientProfileByIdFailure(searchString)) })
}


export const searchPatientByIdRequest = searchString => ({ type: actionTypes.searchPatientById.SEARCH_PATIENTS_BY_ID_REQUEST, payload: searchString });
export const searchPatientByIdFailure = patientId => ({ type: actionTypes.searchPatientById.SEARCH_RESULT_BY_ID_FAILURE, payload: patientId });
export const searchPatientByIdSuccess = data => ({ type: actionTypes.searchPatientById.SEARCH_RESULT_BY_ID_SUCCESS, payload: data });

export const searchPatientByIdAPICall = (searchString) => dispatch => {
    dispatch(searchPatientByIdRequest());
    return apiHelper(`/patients?id=${searchString}`)
        .then(json => {
            console.log(json);
            dispatch(searchPatientByIdSuccess(json))
        })
        .catch(err => { dispatch(searchPatientByIdFailure(searchString)) })
}