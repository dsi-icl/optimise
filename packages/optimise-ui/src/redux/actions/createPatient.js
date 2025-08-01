import { addError } from './error';
import store from '../store';
import actionTypes from './listOfActions';
import { getPatientProfileById, getPatientProfileByIdRequest } from './searchPatient';
import { apiHelper } from '../fetchHelper';

export const createPatientRequest = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_REQUEST, payload: patientId });
export const createPatientSuccess = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_SUCCESS, payload: patientId });
export const createPatientCall = body => dispatch => (
    apiHelper('/patients', { method: 'POST', body: JSON.stringify(body.patientData) })
        .then((json) => {
            dispatch(getPatientProfileByIdRequest());
            const patientId = json.state;
            body.PIIData.patient = json.state;
            body.diagnosisData.patient = json.state;
            const demoData = { ...body.demoData, patient: patientId };
            return apiHelper('/demographics/Demographic', { method: 'POST', body: JSON.stringify(demoData) });
        })
        .then(() => {
            dispatch(getPatientProfileByIdRequest());
            return apiHelper('/patientDiagnosis/', { method: 'POST', body: JSON.stringify(body.diagnosisData) });
        })
        .then(() => {
            dispatch(getPatientProfileByIdRequest());
            return apiHelper('/patientPii/', { method: 'POST', body: JSON.stringify(body.PIIData) });
        })
        .then(() => { dispatch(getPatientProfileById(body.patientId)); })
        .catch((err) => {
            store.dispatch(addError({ error: err }));
        })

);

export const updatePatientCall = body => dispatch => (
    apiHelper('/demographics/Demographic', { method: 'PUT', body: JSON.stringify(body.demoData) })
        .then(() => {
            dispatch(getPatientProfileByIdRequest());
            return apiHelper('/patientPii', { method: 'PUT', body: JSON.stringify(body.PIIData) });
        })
        .then(() => { dispatch(getPatientProfileById(body.patientId)); })
        .catch(err => store.dispatch(addError({ error: err })))
);
