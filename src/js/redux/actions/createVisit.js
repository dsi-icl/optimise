import { getPatientProfileById } from './searchPatientById.js';
import actionTypes from './listOfActions.js';
import { apiHelper } from '../fetchHelper.js';

const createVisitRequest = (body) => ({ type: actionTypes.visits.CREATE_VISIT_REQUEST, payload: body });
const createVisitSuccess = (json) => ({ type: actionTypes.visits.CREATE_VISIT_SUCCESS, payload: json });

export const createVisitAPICall = (body) => dispatch => {
    console.log(body);
    return apiHelper('/visits', { method: 'POST', body: JSON.stringify(body.data) })
        .then(text => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(res => res.text().then(msg => console.log(msg)));
}