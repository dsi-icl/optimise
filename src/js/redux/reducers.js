import initialState from './initialState.js';
import { combineReducers } from 'redux';
import actionTypes from './actions/listOfActions.js';

function login(state = initialState.login, action) {
    switch (action.type) {
        case actionTypes.login.LOGIN_REQUESTED:
            return { ...state, loggingIn: true, loginFailed: false, loggedIn: false, initialCheckingStatus: false, username: action.payload.username };
        case actionTypes.login.LOGIN_FAILURE:
            return { ...state, loginFailed: true, loggingIn: false, loggedIn: false, initialCheckingStatus: false };
        case actionTypes.login.LOGIN_SUCCESS:
            return { ...state, loggingIn: false, loggedIn: true, loginFailed: false, initialCheckingStatus: false };
        case actionTypes.login.CHECKING_LOGIN:
            return { ...state, loggingIn: false, loggedIn: false, loginFailed: false, initialCheckingStatus: true };
        case actionTypes.login.LOGGED_IN:
            return { ...state, loggingIn: false, loggedIn: true, loginFailed: false, initialCheckingStatus: false, username: action.payload.username };
        case actionTypes.login.NOT_LOGGED_IN:
            return { ...state, loggingIn: false, loggedIn: false, loginFailed: false, initialCheckingStatus: false };
        case actionTypes.login.LOGOUT_REQUEST:
            return { username: '', loggingIn: false, loggedIn: false, loginFailed: false, initialCheckingStatus: false };
        default:
            return state;
    }
}

function searchPatientById(state = initialState.searchPatientById, action) {
    switch (action.type) {
        case actionTypes.searchPatientById.SEARCH_PATIENTS_BY_ID_REQUEST:
            return { ...state, result: [], fetching: true, error: false };
        case actionTypes.searchPatientById.SEARCH_PATIENTS_BY_ID_FAILURE:
            return { ...state, result: [], error: true };
        case actionTypes.searchPatientById.SEARCH_PATIENTS_BY_ID_SUCCESS:
            return { ...state, result: action.payload, error: false, fetching: false };
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

function availableFields(state = initialState.availableFields, action) {
    let newState;
    switch (action.type) {
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
            newState = { ...state, VSFields: action.payload.slice(0, 6), visitFields: action.payload.slice(6) };
            break;
        case actionTypes.availableFields.GET_RELATIONS_SUCCESS:
            newState = { ...state, relations: action.payload.relations, medicalConditions: action.payload.conditions };
            break;
        case actionTypes.availableFields.GET_DIAGNOSES_SUCCESS:
            newState = { ...state, diagnoses: action.payload };
            break;
        case actionTypes.availableFields.GET_CE_FIELDS_SUCCESS:
            newState = { ...state, clinicalEventFields: action.payload };
            break;
        case actionTypes.availableFields.GET_PREGNANCY_OUTCOMES_SUCCESS:
            newState = { ...state, pregnancyOutcomes: action.payload };
            break;
        case actionTypes.availableFields.GET_INTERRUPTION_REASONS_SUCESS:
            newState = { ...state, interruptionReasons: action.payload };
            break;
        case actionTypes.availableFields.GET_MEDDRA_SUCESS:
            const meddraHashTable = action.payload.reduce((map, el) => { map[el.id] = el.name; return map; }, {});
            newState = { ...state, allMeddra: [meddraHashTable] };
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
        case actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_REQUEST:
            return { fetching: true, data: {} };
        case actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_SUCCESS:
            return { fetching: false, data: action.payload };
        case actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_FAILURE:
            return { fetching: true, data: { patientId: 'cannot find you patient :(' } };
        default:
            return state;
    }
}

function meddra(state = initialState.meddra, action) {
    switch (action.type) {
        case actionTypes.searchMedDRA.SEARCH_MEDDRA_SUCCESS:
            return { result: action.payload };
        case actionTypes.searchMedDRA.SEARCH_MEDDRA_FAILURE:
            return { result: [] };
        default:
            return state;
    }
}

function log(state = initialState.log, action) {
    switch(action.type) {
        case actionTypes.admin.GET_LOG_REQUEST:
            return { result: [], fetching: true, error: false };
        case actionTypes.admin.GET_LOG_SUCCESS:
            return { result: action.payload, fetching: false, error: false };
        case actionTypes.admin.GET_LOG_FAILURE:
            return { result: [], fetching: false, error: true };
        default:
            return state;

    }
}

function getAllUsers(state = initialState.getAllUsers, action) {
    switch(action.type) {
        case actionTypes.admin.GET_ALL_USERS_REQUEST:
            return { result: [], fetching: true, error: false };
        case actionTypes.admin.GET_ALL_USERS_SUCCESS:
            return { result: action.payload, fetching: false, error: false };
        case actionTypes.admin.GET_ALL_USERS_FAILURE:
            return { result: [], fetching: false, error: true };
        default:
            return state;

    }
}

function erasePatient(state = initialState.erasePatient, action) {
    switch(action.type) {
        case actionTypes.erasePatient.ERASE_PATIENT_REQUEST:
            return { requesting: true, success: false, error: false };
        case actionTypes.erasePatient.ERASE_PATIENT_FAILTURE:
            return { requesting: false, success: false, error: true };
        case actionTypes.erasePatient.ERASE_PATIENT_SUCCESS:
            return { requesting: false, success: true, error: false };
        case actionTypes.erasePatient.ERASE_PATIENT_RESET:
            return { requesting: false, success: false, error: false };
        default:
            return state;

    }
}

export const rootReducer = combineReducers({
    createPatient,
    searchPatientById,
    patientProfile,
    availableFields,
    login,
    meddra,
    log,
    getAllUsers,
    erasePatient
});

