import initialState from './initialState.js';

export const rootReducer = (state = initialState, action) => {     //need to change to immutables
    switch (action.type) {
    case 'SEARCH_PATIENTS_BY_ID_REQUEST':
        return {...state, patientProfile: {fetching: true, data: {}}};
    case 'SEARCH_RESULT_BY_ID_SUCCESS':
        return {...state, rightPanel: 1, patientProfile: {fetching: false, data: action.payload}};
    case 'CLICKED_CREATE_PATIENT':
        return {...state, rightPanel: 2, createPatient: {patientId: action.payload}};
    default:
        return state;
    }
};