import initialState from './initialState.js';
import { combineReducers } from 'redux';
import actionTypes from './actions/listOfActions.js';
import { all } from 'promise/lib/es6-extensions';

function login(state = initialState.login, action) {
    switch (action.type) {
        case actionTypes.login.LOGIN_REQUESTED:
            return { ...state, loggingIn: true, loginFailed: false, loggedIn: false };
        case actionTypes.login.LOGIN_FAILURE:
            return { ...state, loginFailed: true, loggingIn: false, loggedIn: false };
        case actionTypes.login.LOGIN_SUCCESS:
            return { loggingIn: false, loggedIn: true, loginFailed: false, token: action.payload.token }
        default:
            return state;
    }
}

function fetchingFinished(state) {
    const stateCopy = Object.assign({}, state);
    delete stateCopy.fetching;
    for (let each in stateCopy) {
        if (stateCopy[each].length === 0) {
            return false;
        }
    }
    return true;
}

function availableFields(state = initialState.availableFields, action){
    const allFetchFinished = fetchingFinished(state);
    switch (action.type){
        case actionTypes.availableFields.GET_CE_TYPES_SUCCESS:
            return { ...state, clinicalEventTypes: action.payload, fetching: !allFetchFinished };
        case actionTypes.availableFields.GET_DEMO_FIELDS_SUCCESS:
            return { ...state, demoFields: action.payload, fetching: !allFetchFinished };
        case actionTypes.availableFields.GET_DRUGS_SUCCESS:
            return { ...state, drugs: action.payload, fetching: !allFetchFinished };
        case actionTypes.availableFields.GET_INPUT_TYPES_SUCCESS:
            return { ...state, inputTypes: action.payload, fetching: !allFetchFinished };
        case actionTypes.availableFields.GET_TEST_FIELDS_SUCCESS:
            return { ...state, testFields: action.payload, fetching: !allFetchFinished };
        case actionTypes.availableFields.GET_TEST_TYPES_SUCCESS:
            return { ...state, testTypes: action.payload, fetching: !allFetchFinished };
        case actionTypes.availableFields.GET_VISIT_FIELDS_SUCCESS:
            return { ...state, visitFields: action.payload, fetching: !allFetchFinished };
        default:
            return state
    }
}

function createPatient(state = initialState.createPatient, action) {
    switch (action.type) {
        case 'CLICKED_CREATE_PATIENT':
            return { patientId: action.payload };
        default:
            return state; 
    }
}

function patientProfile(state = initialState.patientProfile, action) {
    switch (action.type) {
        case actionTypes.searchPatientById.SEARCH_PATIENTS_BY_ID_REQUEST:
            return { fetching: true, data: {} };
        case actionTypes.searchPatientById.SEARCH_RESULT_BY_ID_SUCCESS:
            return { fetching: false, data: action.payload };
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    createPatient,
    patientProfile,
    availableFields,
    login
})

