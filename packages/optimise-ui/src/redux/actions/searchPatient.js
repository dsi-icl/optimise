import actionTypes from './listOfActions';
import { apiHelper } from '../fetchHelper';

export const searchPatientRequest = searchString => ({ type: actionTypes.searchPatient.SEARCH_PATIENTS_BY_ID_REQUEST, payload: searchString });
export const searchPatientFailure = patientId => ({ type: actionTypes.searchPatient.SEARCH_PATIENTS_BY_ID_FAILURE, payload: patientId });
export const searchPatientSuccess = data => ({ type: actionTypes.searchPatient.SEARCH_PATIENTS_BY_ID_SUCCESS, payload: data });
export const searchPatientClear = () => ({ type: actionTypes.searchPatient.SEARCH_PATIENTS_BY_ID_CLEAR });

export const searchPatientAPICall = (searchString) => dispatch => {
    console.log('search string:',searchString);
    dispatch(searchPatientRequest(searchString));
    return apiHelper(`/patients?field=${searchString.field}&value=${searchString.value}`)
        .then(json => {
            dispatch(searchPatientSuccess(json));
            console.log(json);
        })
        .catch(() => { dispatch(searchPatientFailure(searchString)); });
};


export const getPatientProfileByIdRequest = searchString => ({ type: actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_REQUEST, payload: searchString });
export const getPatientProfileByIdFailure = patientId => ({ type: actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_FAILURE, payload: patientId });
export const getPatientProfileByIdSuccess = load => ({ type: actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_SUCCESS, payload: load });

export const getPatientProfileById = (searchString) => dispatch => {
    dispatch(getPatientProfileByIdRequest(searchString));
    return apiHelper(`/patients/${searchString}`)
        .then(json => {
            dispatch(getPatientProfileByIdSuccess(json));
        })
        .catch(() => dispatch(getPatientProfileByIdFailure(searchString)));
};
