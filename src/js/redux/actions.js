export const searchPatientsByIdRequest = searchString => ({type: 'SEARCH_PATIENTS_BY_ID_REQUEST', payload: searchString});
export const searchResultByIdSuccess = data => ({type: 'SEARCH_RESULT_BY_ID_SUCCESS', payload: data});
export const getPatientProfileById = (searchString) => {
    return dispatch => {
        dispatch(searchPatientsByIdRequest(searchString));
        return fetch(`/api/patientProfile/${searchString}`,{
            mode: 'cors',
            headers: {'token': 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb'}   //change later
            })
            .then(res => res.json(), err => console.log(err))
            .then(json => {
                console.log(json);
                dispatch(searchResultByIdSuccess(json))
            })
        }
}

export const createPatientRequest = patientId => ({type: 'CREATE_PATIENT_REQUEST', payload: patientId});
export const createPatientSuccess = patientId => ({type: 'CREATE_PATIENT_SUCCESS', payload: patientId});
export const createPatientCall = (patientId) => {
    return dispatch => {
        dispatch(createPatientRequest(patientId));
        return fetch(`/api/patients`,{
            method: 'POST',
            mode: 'cors',
            headers: {'content-type': 'application/json',
                'token': 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb'},   //change later
            body: JSON.stringify({"alias_id": patientId, "study": "optimise"})
            })
            .then(res => res.json(), err => console.log(err))
            .then(json => {
                console.log(json);
                dispatch(createPatientSuccess(json))
            })
        }
}


export const clickedCreatePatient = patientId => ({type: 'CLICKED_CREATE_PATIENT', payload: patientId});