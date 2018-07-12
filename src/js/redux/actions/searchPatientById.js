import actionTypes from './listOfActions.js';

export const getPatientProfileByIdRequest = searchString => ({ type: actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_REQUEST, payload: searchString });
export const getPatientProfileByIdFailure = patientId => ({ type: actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_FAILURE, payload: patientId });
export const getPatientProfileByIdSuccess = data => ({ type: actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_SUCCESS, payload: data });


export const getPatientProfileById = (searchString) => dispatch => {
    dispatch(getPatientProfileByIdRequest(searchString));
    return fetch(`/patients/${searchString}`, {
        mode: 'cors',
        headers: { 'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a' }   //change later
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                dispatch(getPatientProfileByIdFailure(searchString));
                return Promise.reject('404');
            }
        }, err => console.log(err))
        .then(json => {
            console.log(json);
            dispatch(getPatientProfileByIdSuccess(json))
        })
}


export const searchPatientByIdRequest = searchString => ({ type: actionTypes.searchPatientById.SEARCH_PATIENTS_BY_ID_REQUEST, payload: searchString });
export const searchPatientByIdFailure = patientId => ({ type: actionTypes.searchPatientById.SEARCH_RESULT_BY_ID_FAILURE, payload: patientId });
export const searchPatientByIdSuccess = data => ({ type: actionTypes.searchPatientById.SEARCH_RESULT_BY_ID_SUCCESS, payload: data });

export const searchPatientByIdAPICall = (searchString) => dispatch => {
    dispatch(searchPatientByIdRequest());
    return fetch(`/patients?id=${searchString}`, {
        mode: 'cors',
        headers: { 'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a' }   //change later
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                dispatch(searchPatientByIdFailure(searchString));
                return Promise.reject('404');
            }
        }, err => console.log(err))
        .then(json => {
            console.log(json);
            dispatch(searchPatientByIdSuccess(json))
        })
}