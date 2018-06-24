export const createPatientRequest = patientId => ({ type: 'CREATE_PATIENT_REQUEST', payload: patientId });
export const createPatientSuccess = patientId => ({ type: 'CREATE_PATIENT_SUCCESS', payload: patientId });
export const createPatientCall = (patientId) => dispatch => {
    dispatch(createPatientRequest(patientId));
    return fetch('/api/patients', {
        method: 'POST',
        mode: 'cors',
        headers: { 'content-type': 'application/json',
            'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a' },   //change later
        body: JSON.stringify({ 'aliasId': patientId, 'study': 'optimise' })
    })
        .then(res => res.json(), err => console.log(err))
        .then(json => {
            console.log(json);
            dispatch(createPatientSuccess(json))
        })
}


export const clickedCreatePatient = patientId => ({ type: 'CLICKED_CREATE_PATIENT', payload: patientId });