import initialState from './initialState.js';
import { combineReducers } from 'redux';
import actionTypes from './actions/listOfActions.js';

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
    let newState;
    switch (action.type){
        case actionTypes.availableFields.GET_CE_TYPES_SUCCESS:
            newState = { ...state, clinicalEventTypes: action.payload };
            break;
        case actionTypes.availableFields.GET_DEMO_FIELDS_SUCCESS:
            newState = { ...state, demoFields: [action.payload] };
            break;
        case actionTypes.availableFields.GET_DRUGS_SUCCESS:
            newState = { ...state, drugs: action.payload };
            break;
        case actionTypes.availableFields.GET_INPUT_TYPES_SUCCESS:
            newState = { ...state, inputTypes: action.payload };
            break;
        case actionTypes.availableFields.GET_TEST_FIELDS_SUCCESS:
            newState = { ...state, testFields: action.payload };
            break;
        case actionTypes.availableFields.GET_TEST_TYPES_SUCCESS:
            newState = { ...state, testTypes: action.payload };
            break;
        case actionTypes.availableFields.GET_VISIT_FIELDS_SUCCESS:
            newState = { ...state, visitFields: action.payload };
            break;
        case actionTypes.availableFields.GET_RELATIONS_SUCCESS:
            newState = { ...state, relations: action.payload.relations };
            break;
        default:
            return state;
    }
    newState.fetching = !fetchingFinished(newState);
    return newState;
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
        case actionTypes.searchPatientById.SEARCH_RESULT_BY_ID_FAILURE:
            return { fetching: true, data: { patientId: 'cannot find you patient :(' } }
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

