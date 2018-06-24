export const searchPatientsByIdRequest = searchString => ({ type: 'SEARCH_PATIENTS_BY_ID_REQUEST', payload: searchString });

export const searchResultByIdSuccess = data => ({ type: 'SEARCH_RESULT_BY_ID_SUCCESS', payload: data });

export const getPatientProfileById = (searchString) => dispatch => {
    dispatch(searchPatientsByIdRequest(searchString));
    return fetch(`/api/patientProfile/${searchString}`, {
        mode: 'cors',
        headers: { 'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a' }   //change later
    })
        .then(res => res.json(), err => console.log(err))
        .then(json => {
            console.log(json);
            dispatch(searchResultByIdSuccess(json))
        })
}