export const addNewData = data => ({ type: 'ADD_NEW_DATA', payload: data });

export const updateData = data => ({ type: 'UPDATE_DATA', payload: data });

export const commitChangesRequest = patientId => ({ type: 'COMMIT_CHANGES_REQUEST', payload: patientId });

export const commitChangesSuccess = patientId => ({ type: 'COMMIT_CHANGES_SUCCESS', payload: patientId });