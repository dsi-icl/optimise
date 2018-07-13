import actionTypes from './listOfActions.js';
import { getPatientProfileById, getPatientProfileByIdRequest } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const createPatientRequest = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_REQUEST, payload: patientId });
export const createPatientSuccess = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_SUCCESS, payload: patientId });
export const createPatientCall = (body) => dispatch => (
    apiHelper('/patients', { method: 'POST', body: JSON.stringify(body.patientData) })
        .then(json => {
            dispatch(getPatientProfileByIdRequest());
            const patientId = json[0];
            body.PIIData.patient = json[0];
            body.diagnosisData.patient = json[0];
            const demoData = { ...body.demoData, patient: patientId };
            return apiHelper('/demographics/Demographic', { method: 'POST', body: JSON.stringify(demoData) });
        })
        .then(json => {
            console.debug('DIAGNOSIS CALL > ', body.diagnosisData);
            dispatch(getPatientProfileByIdRequest());
            return apiHelper('/patientDiagnosis/', { method: 'POST', body: JSON.stringify(body.diagnosisData) });
        })
        .then(json => {
            dispatch(getPatientProfileByIdRequest());
            console.debug('PII CALL > ', body.PIIData);
            return apiHelper('/patientPii/', { method: 'POST', body: JSON.stringify(body.PIIData) });
        })
        .then(() => { dispatch(getPatientProfileById(body.patientId)); })
        .catch(err => console.debug('ERROR! > ', err))

);