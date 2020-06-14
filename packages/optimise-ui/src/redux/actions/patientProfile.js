import { addError } from './error';
import actionTypes from './listOfActions';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const filterHistory = (filter) => ({ type: actionTypes.patientProfile.HISTORY_FILTER, filter });

export const getPatientPiiRequest = (patientId) => ({ type: actionTypes.patientProfile.PII_REQUEST, payload: patientId });
export const getPatientPiiSuccess = (pii) => ({ type: actionTypes.patientProfile.PII_RECEIVED, payload: pii });
export const getPatientPii = (body) => dispatch => {
    dispatch(getPatientPiiRequest(body.patient));
    return apiHelper(`/patientPii/?patient=${body.patient}`)
        .then(json => {
            dispatch(getPatientPiiSuccess(json));
        })
        .catch(err => dispatch(addError({ error: JSON.stringify(err) })));
};

export const changePatientId = (body) => dispatch =>
    apiHelper('/patients', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
        })
        .catch(err => dispatch(addError({ error: JSON.stringify(err) })));
