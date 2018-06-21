export const addNewData = data => ({ type: 'ADD_NEW_DATA', payload: data });

export const updateData = data => ({ type: 'UPDATE_DATA', payload: data });

export const commitChangesRequest = patientId => ({ type: 'COMMIT_CHANGES_REQUEST', payload: patientId });

export const commitChangesSuccess = patientId => ({ type: 'COMMIT_CHANGES_SUCCESS', payload: patientId });

// export const commitChangesCall = (patientId) => {
//     return dispatch => {
//         dispatch(commitChangesRequest(patientId));
//         // return fetch('/api/patients',{
//         //     method: 'POST',
//         //     mode: 'cors',
//         //     headers: {'content-type': 'application/json',
//         //         'token': 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb'},   //change later
//         //     body: JSON.stringify({'alias_id': patientId, 'study': 'optimise'})
//         })
//             .then(res => res.json(), err => console.log(err))
//             .then(json => {
//                 console.log(json);
//                 dispatch(createPatientSuccess(json))
//             })
//     }
// }