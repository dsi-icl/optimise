import { addError } from './error';
import store from '../store';
import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';
import { alterDataCall } from './addOrUpdateData';

export const createImmunisationAPICall = (body) => dispatch => (
    apiHelper('/demographics/Immunisation', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const editImmunisationAPICall = (body) => dispatch => (
    apiHelper('/demographics/Immunisation', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const deleteImmunisationAPICall = (body) => dispatch => (
    apiHelper('/demographics/Immunisation', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const createPregnancyAPICall = (body, callback) => dispatch => (
    apiHelper('/demographics/Pregnancy', { method: 'POST', body: JSON.stringify(body.data) })
        .then((json) => {
            dispatch(getPatientProfileById(body.patientId));
            if (typeof callback === 'function') {
                callback(json);
            }
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const editPregnancyAPICall = (body) => dispatch => (
    apiHelper('/demographics/Pregnancy', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const deletePregnancyAPICall = (body) => dispatch => (
    apiHelper('/demographics/Pregnancy', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const alterPregnancyItemsCall = (body, callback) => async (dispatch) => {
    try {
        //if pregnancy entry needs to be created and entry type is 1 (baseline) then new pregnancy needs to be created

        const pregnancyMethod = body.pregnancyEntry?.type === 1 && !body.pregnancy.id ? 'POST' : 'PUT';
        const pregnancyResponse = await apiHelper('/demographics/Pregnancy', {
            method: pregnancyMethod,
            body: JSON.stringify(body.pregnancy)
        });

        const pregnancyId = pregnancyResponse.state;
        if (body.pregnancyEntry) {
            if (body.pregnancyEntry.type === 1 && !body.pregnancy.id) {
                body.pregnancyEntry.pregnancyId = pregnancyId;
            }
            const pregnancyEntryResponse = await apiHelper('/demographics/PregnancyEntry', {
                method: 'POST',
                body: JSON.stringify({ ...body.pregnancyEntry })
            });

            const pregnancyEntryId = pregnancyEntryResponse.state;
            if (body.data) {
                body.data.pregnancyEntryId = pregnancyEntryId;
            }
        }

        if (body.data) {
            await dispatch(alterDataCall(body, callback));
        } else {
            callback();
            dispatch(getPatientProfileById(body.patientId));
        }
    } catch (msg) {
        dispatch(addError({ error: msg }));
    }
};

export const createPregnancyImageAPICall = (body) => dispatch => (
    apiHelper('/demographics/PregnancyImage', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => {
            store.dispatch(addError({ error: msg }));
        })
);

export const editPregnancyImageAPICall = (body) => dispatch => (
    apiHelper('/demographics/PregnancyImage', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const deletePregnancyImageAPICall = (body) => dispatch => (
    apiHelper('/demographics/PregnancyImage', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const updateDemographicAPICall = (body) => dispatch => (
    apiHelper('/demographics/Demographic', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const createDiagnosisAPICall = (body) => dispatch => (
    apiHelper('/patientDiagnosis', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const updateDiagnosisAPICall = (body) => dispatch => (
    apiHelper('/patientDiagnosis', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);

export const deleteDiagnosisAPICall = (body) => dispatch => (
    apiHelper('/patientDiagnosis', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => store.dispatch(addError({ error: msg })))
);