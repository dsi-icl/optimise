import { addError } from './error';
import store from '../store';
import actionTypes from './listOfActions';
import { apiHelper } from '../fetchHelper';

export const erasePatientRequest = body => ({ type: actionTypes.erasePatient.ERASE_PATIENT_REQUEST, payload: body });
export const erasePatientSuccess = body => ({ type: actionTypes.erasePatient.ERASE_PATIENT_SUCCESS, payload: body });
export const erasePatientFailure = body => ({ type: actionTypes.erasePatient.ERASE_PATIENT_FAILTURE, payload: body });
export const erasePatientReset = () => ({ type: actionTypes.erasePatient.ERASE_PATIENT_RESET });

export const erasePatientAPICall = body => (dispatch) => {
    dispatch(erasePatientRequest());
    apiHelper('/patients', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(erasePatientSuccess(body.patientId));
        })
        .catch((err) => { store.dispatch(addError({ error: err })); dispatch(erasePatientFailure()); });
};
