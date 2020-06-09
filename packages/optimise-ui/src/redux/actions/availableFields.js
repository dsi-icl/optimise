import { addError } from './error';
import store from '../store';
import actions from './listOfActions';
import { apiHelper } from '../fetchHelper';

export const APICall = (endpoint, cbDispatch) => () => (dispatch) => apiHelper(endpoint)
    .then(json => {
        dispatch(cbDispatch(json));
    })
    .catch(msg => store.dispatch(addError({ error: msg })));


export const getVisitSectionsSuccess = (payload) => ({ type: actions.availableFields.GET_VISIT_SECTIONS_SUCCESS, payload: payload });
export const getVisitSectionsCall = APICall('/available/visitSections', getVisitSectionsSuccess);


export const getDrugsSuccess = (payload) => ({ type: actions.availableFields.GET_DRUGS_SUCCESS, payload: payload });
export const getDrugsCall = APICall('/treatments/drugs', getDrugsSuccess);


export const getInterruptionReasonsSuccess = (payload) => ({ type: actions.availableFields.GET_INTERRUPTION_REASONS_SUCESS, payload: payload });
export const getInterruptionReasonsCall = APICall('/treatments/reasons', getInterruptionReasonsSuccess);


export const getMeddraSuccess = (payload) => ({ type: actions.availableFields.GET_MEDDRA_SUCESS, payload: payload });
export const getMeddraCall = APICall('/meddra', getMeddraSuccess);

export const getICD11Success = (payload) => ({ type: actions.availableFields.GET_ICD11_SUCCESS, payload: payload });
export const getICD11Call = APICall('/icd11', getICD11Success);

export const getPregnancyOutcomesSuccess = (payload) => ({ type: actions.availableFields.GET_PREGNANCY_OUTCOMES_SUCCESS, payload: payload });
export const getPregnancyOutcomesCall = APICall('/demographics/Fields/Pregnancy', getPregnancyOutcomesSuccess);


export const getCEFieldsSuccess = (payload) => ({ type: actions.availableFields.GET_CE_FIELDS_SUCCESS, payload: payload });
export const getCEFieldsCall = APICall('/available/ceFields', getCEFieldsSuccess);


export const getDiagnosesSuccess = (payload) => ({ type: actions.availableFields.GET_DIAGNOSES_SUCCESS, payload: payload });
export const getDiagnosesCall = APICall('/available/diagnoses', getDiagnosesSuccess);


export const getDemoSuccess = (payload) => ({ type: actions.availableFields.GET_DEMO_FIELDS_SUCCESS, payload: payload });
export const getDemoCall = APICall('/demographics/Fields/Demographic', getDemoSuccess);


export const getRelationSuccess = (payload) => ({ type: actions.availableFields.GET_RELATIONS_SUCCESS, payload: payload });
export const getRelationCall = APICall('/demographics/Fields/MedicalCondition', getRelationSuccess);


export const getVisitFieldsSuccess = (payload) => ({ type: actions.availableFields.GET_VISIT_FIELDS_SUCCESS, payload: payload });
export const getVisitFieldsCall = APICall('/data/visitFields', getVisitFieldsSuccess);


export const getTestFieldsSuccess = (payload) => ({ type: actions.availableFields.GET_TEST_FIELDS_SUCCESS, payload: payload });
export const getTestFieldsCall = APICall('/data/testFields', getTestFieldsSuccess);


export const getClinicalEventTypesSuccess = (payload) => ({ type: actions.availableFields.GET_CE_TYPES_SUCCESS, payload: payload });
export const getClinicalEventTypesCall = APICall('/data/clinicalEvents', getClinicalEventTypesSuccess);


export const getTestTypesSuccess = (payload) => ({ type: actions.availableFields.GET_TEST_TYPES_SUCCESS, payload: payload });
export const getTestTypesCall = APICall('/data/testTypes', getTestTypesSuccess);

export const getConcomitantMedsSuccess = (payload) => ({ type: actions.availableFields.GET_CONCOMITANT_MEDS_SUCCESS, payload: payload });
export const getConcomitantMedsCall = APICall('/data/concomitantMedsList', getConcomitantMedsSuccess);