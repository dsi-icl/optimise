import initialState from './initialState.js';
import { combineReducers } from 'redux';

// export const rootReducer = (state = initialState, action) => {     //need to change to immutables
//     switch (action.type) {
//     case 'SEARCH_PATIENTS_BY_ID_REQUEST':
//         return {...state, patientProfile: {fetching: true, data: {}}};
//     case 'SEARCH_RESULT_BY_ID_SUCCESS':
//         return {...state, rightPanel: 1, patientProfile: {fetching: false, data: action.payload}};
//     case 'CLICKED_CREATE_PATIENT':
//         return {...state, rightPanel: 2, createPatient: {patientId: action.payload}};
//     default:
//         return state;
//     }
// };
function middlePanel(state = 1, action){
    return state;
}

function rightPanel(state = 2, action){
    return state;
}

function availableFields(state = initialState.availableFields, action){
    return state;
}

function createPatient(state = {patientId: ''}, action) {
    switch (action.type) {
        case 'CLICKED_CREATE_PATIENT':
            return {patientId: action.payload};
        default:
            return state; 
    }
}

function patientProfile(state = initialState.patientProfile, action) {
    switch (action.type) {
        case 'SEARCH_PATIENTS_BY_ID_REQUEST':
            return {fetching: true, data: {}};
        case 'SEARCH_RESULT_BY_ID_SUCCESS':
            return {fetching: false, data: action.payload};
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    middlePanel,
    rightPanel,
    createPatient,
    patientProfile,
    availableFields
})

