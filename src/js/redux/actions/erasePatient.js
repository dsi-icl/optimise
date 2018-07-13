import actionTypes from './listOfActions.js';
import { apiHelper } from '../fetchHelper.js';

export const erasePatientRequest = (body) => ({ type: actionTypes.erasePatient.ERASE_PATIENT_REQUEST, payload: body });
export const erasePatientSuccess = (body) => ({ type: actionTypes.erasePatient.ERASE_PATIENT_SUCCESS, payload: body });
export const erasePatientFailure = (body) => ({ type: actionTypes.erasePatient.ERASE_PATIENT_FAILTURE, payload: body });
export const erasePatientReset = () => ({ type: actionTypes.erasePatient.ERASE_PATIENT_RESET });

export const erasePatientAPICall = (body) => dispatch => {
    erasePatientRequest();
    apiHelper('/patients', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(erasePatientSuccess(body.patientId));
        })
        .catch(err => { console.log(err); erasePatientFailure(); });
}