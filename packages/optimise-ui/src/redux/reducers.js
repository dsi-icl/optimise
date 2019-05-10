import initialState from './initialState';
import { combineReducers } from 'redux';
import actionTypes from './actions/listOfActions';
import { dispatch as workerDispatch } from '../webWorker';

function login(state = initialState.login, action) {
    switch (action.type) {
        case actionTypes.login.LOGIN_REQUESTED:
            return { ...state, loggingIn: true, loginFailed: false, loggedIn: false, initialCheckingStatus: false, username: action.payload.username };
        case actionTypes.login.LOGIN_FAILURE:
            return { ...state, loginFailed: true, loggingIn: false, loggedIn: false, initialCheckingStatus: false };
        case actionTypes.login.LOGIN_SUCCESS:
            return { ...state, loggingIn: false, loggedIn: true, loginFailed: false, initialCheckingStatus: false, username: action.payload.username || (action.payload.account ? action.payload.account.username : ''), priv: action.payload.priv || (action.payload.account ? action.payload.account.priv : 0) };
        case actionTypes.login.CHECKING_LOGIN:
            return { ...state, loggingIn: false, loggedIn: false, loginFailed: false, initialCheckingStatus: true };
        case actionTypes.login.LOGGED_IN:
            return { ...state, loggingIn: false, loggedIn: true, loginFailed: false, initialCheckingStatus: false, username: action.payload.username, priv: action.payload.priv || (action.payload.account ? action.payload.account.priv : 0) };
        case actionTypes.login.NOT_LOGGED_IN:
            return { ...state, loggingIn: false, loggedIn: false, loginFailed: false, initialCheckingStatus: false };
        case actionTypes.login.LOGOUT_REQUEST:
            return { username: '', loggingIn: false, loggedIn: false, loginFailed: false, initialCheckingStatus: false };
        default:
            return state;
    }
}

function searchPatient(state = initialState.searchPatient, action) {
    switch (action.type) {
        case actionTypes.searchPatient.SEARCH_PATIENTS_BY_ID_REQUEST: {
            let tmp = { ...state, fetching: true, error: false, currentSearchType: action.payload.field, currentSearchString: action.payload.value };
            if (action.payload.value === '')
                tmp.result = [];
            return tmp;
        }
        case actionTypes.searchPatient.SEARCH_PATIENTS_BY_ID_FAILURE:
            return { ...state, result: [], error: true };
        case actionTypes.searchPatient.SEARCH_PATIENTS_BY_ID_SUCCESS:
            return { ...state, result: action.payload, error: false, fetching: false };
        case actionTypes.searchPatient.SEARCH_PATIENTS_BY_ID_CLEAR:
            return { ...state, result: [], error: false, fetching: false };
        default:
            return state;
    }
}

function fetchingFinished(state) {
    const stateCopy = { ...state };
    for (let each in stateCopy) {
        if (stateCopy[each] === null) {
            return false;
        }
    }
    return true;
}

function availableFields(state = initialState.availableFields, action) {
    let newState;
    let hash;
    switch (action.type) {
        case actionTypes.availableFields.GET_CE_TYPES_SUCCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el.name; return map; }, {});
            newState = { ...state, clinicalEventTypes: action.payload, clinicalEventTypes_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_DEMO_FIELDS_SUCCESS:
            hash = {};
            for (let each of Object.keys(action.payload)) {
                hash[each] = action.payload[each].reduce((map, el) => { map[el.id] = el.value; return map; }, {});
            }
            newState = { ...state, demoFields: [action.payload], demoFields_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_DRUGS_SUCCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el; return map; }, {});
            newState = { ...state, drugs: action.payload, drugs_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_INPUT_TYPES_SUCCESS:
            newState = { ...state, inputTypes: action.payload };
            break;
        case actionTypes.availableFields.GET_TEST_FIELDS_SUCCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el; return map; }, {});
            newState = { ...state, testFields: action.payload, testFields_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_TEST_TYPES_SUCCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el.name; return map; }, {});
            newState = { ...state, testTypes: action.payload, testTypes_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_VISIT_FIELDS_SUCCESS:
            newState = {
                ...state,
                VSFields: action.payload.slice(0, 6),
                visitFields: action.payload.slice(1),
                VSFields_Hash: [
                    action.payload.slice(0, 6).reduce((map, el) => { map[el.id] = el; return map; }, {})
                ],
                visitFields_Hash: [
                    action.payload.slice(1).reduce((map, el) => { map[el.id] = el; return map; }, {})
                ]
            };
            break;
        case actionTypes.availableFields.GET_RELATIONS_SUCCESS:
            newState = {
                ...state,
                relations: action.payload.relations,
                medicalConditions: action.payload.conditions,
                relations_Hash: [
                    action.payload.relations.reduce((map, el) => { map[el.id] = el.value; return map; }, {})
                ],
                medicalConditions_Hash: [
                    action.payload.conditions.reduce((map, el) => { map[el.id] = el.value; return map; }, {})
                ]
            };
            break;
        case actionTypes.availableFields.GET_DIAGNOSES_SUCCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el.value; return map; }, {});
            newState = { ...state, diagnoses: action.payload, diagnoses_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_CE_FIELDS_SUCCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el; return map; }, {});
            newState = { ...state, clinicalEventFields: action.payload, clinicalEventFields_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_PREGNANCY_OUTCOMES_SUCCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el.value; return map; }, {});
            newState = { ...state, pregnancyOutcomes: action.payload, pregnancyOutcomes_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_INTERRUPTION_REASONS_SUCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el; return map; }, {});
            newState = { ...state, interruptionReasons: action.payload, interruptionReasons_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_MEDDRA_SUCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el; return map; }, {});
            workerDispatch({
                type: actionTypes.availableFields.GET_MEDDRA_TREE_SUCESS,
                work: 'tree',
                payload: action.payload
            });
            newState = { ...state, allMeddra: action.payload, meddra_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_MEDDRA_TREE_SUCESS:
            newState = { ...state, meddra_Tree: action.payload };
            break;
        case actionTypes.availableFields.GET_ICD11_SUCCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el; return map; }, {});
            workerDispatch({
                type: actionTypes.availableFields.GET_ICD11_TREE_SUCESS,
                work: 'tree',
                payload: action.payload
            });
            newState = { ...state, icd11: action.payload, icd11_Hash: [hash] };
            break;
        case actionTypes.availableFields.GET_ICD11_TREE_SUCESS:
            newState = { ...state, icd11_Tree: action.payload };
            break;
        case actionTypes.availableFields.GET_VISIT_SECTIONS_SUCCESS:
            hash = action.payload.reduce((map, el) => { map[el.id] = el.name; return map; }, {});
            newState = { ...state, visitSections: action.payload, visitSections_Hash: [hash] };
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
            if (state.currentPatient === action.payload)
                return state;
            else
                return { ...state, fetching: true, data: {} };
        case actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_SUCCESS:
            return { ...state, fetching: false, data: action.payload, currentPatient: action.payload.patientId, historyFilter: state.currentPatient !== action.payload.patientId ? {} : state.historyFilter, lastSuccess: (new Date()).getTime(), pii: undefined };
        case actionTypes.getPatientProfileById.GET_PATIENT_PROFILE_BY_ID_FAILURE:
            return { ...state, fetching: true, data: { patientId: null } };
        case actionTypes.patientProfile.HISTORY_FILTER:
            return { ...state, historyFilter: action.filter };
        case actionTypes.patientProfile.PII_RECEIVED:
            return { ...state, pii: action.payload ? action.payload[0] : undefined };
        default:
            return state;
    }
}


function log(state = initialState.log, action) {
    switch (action.type) {
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
    switch (action.type) {
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
    switch (action.type) {
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

function appLevelError(state = initialState.appLevelError, action) {
    switch (action.type) {
        case actionTypes.appLevelError.ADD_ERROR:
            return action.payload;
        case actionTypes.appLevelError.CLEAR_ERROR:
            return {};
        default:
            return state;
    }
}

function alert(state = initialState.alert, action) {
    switch (action.type) {
        case actionTypes.alert.ADD_ALERT:
            return action.payload;
        case actionTypes.alert.CLEAR_ALERT:
            return {};
        default:
            return state;
    }
}

function edssCalc(state = initialState.edssCalc, action) {
    switch (action.type) {
        case actionTypes.edssCalc.CLEAR_CALCULATOR:
            return { display: false };
        case actionTypes.edssCalc.DISPLAY_CALCULATOR:
            return { display: true };
        default:
            return state;
    }
}

function uploadMeddra(state = initialState.uploadMeddra, action) {
    switch (action.type) {
        case actionTypes.admin.UPLOAD_MEDDRA_REQUEST:
            return { requesting: true, error: undefined, success: false };
        case actionTypes.admin.UPLOAD_MEDDRA_SUCCESS:
            return { requesting: false, error: undefined, success: true };
        case actionTypes.admin.UPLOAD_MEDDRA_FAILURE:
            return { requesting: false, error: action.payload, success: false };
        default:
            return state;
    }
}

function serverInfo(state = initialState.serverInfo, action) {
    switch (action.type) {
        case actionTypes.serverInfo.GET_SERVER_INFO_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    createPatient,
    searchPatient,
    patientProfile,
    availableFields,
    login,
    log,
    getAllUsers,
    erasePatient,
    appLevelError,
    alert,
    edssCalc,
    uploadMeddra,
    serverInfo
});

