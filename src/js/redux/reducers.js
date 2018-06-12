import initialState from './initialState.js';
import { combineReducers } from 'redux';


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

function getPatientById(state = {}, action) {
    switch (action.type) {
        case 'UPDATE_STORE_SEARCH_RESULT':
            return action.payload;
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
    createPatient,
    getPatientById,
    patientProfile,
    availableFields
})

