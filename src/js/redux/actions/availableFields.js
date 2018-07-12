import actions from './listOfActions.js';

export function APICall(endpoint, cbDispatch) {
    return function (body) {
        return function (dispatch) {
            return fetch(endpoint, {
                mode: 'cors',
                headers: {
                    'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a', //change later
                    'content-type': 'application/json'
                },
                method: 'GET',
                body: JSON.stringify(body)
            })
                .then(res => {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        return Promise.reject(res);
                    }
                }, err => console.log(err))
                .then(json => {
                    dispatch(cbDispatch(json));
                })
                .catch(msg => console.log(msg))
        }
    }
};

export const getDrugsCall = APICall('/treatments/drugs', getDrugsSuccess)

export function getDrugsSuccess(payload) {
    return { type: actions.availableFields.GET_DRUGS_SUCCESS, payload: payload }
}

export const getDemoCall = APICall('/demographics/Fields/Demographic', getDemoSuccess)

export function getDemoSuccess(payload) {
    return { type: actions.availableFields.GET_DEMO_FIELDS_SUCCESS, payload: payload }
}

export const getRelationCall = APICall('/demographics/Fields/MedicalCondition', getRelationSuccess)

export function getRelationSuccess(payload) {
    return { type: actions.availableFields.GET_RELATIONS_SUCCESS, payload: payload }
}

export const getVisitFieldsCall = APICall('/data/visitFields', getVisitFieldsSuccess);

export function getVisitFieldsSuccess(payload) {
    return { type: actions.availableFields.GET_VISIT_FIELDS_SUCCESS, payload: payload }
};

export const getTestFieldsCall = APICall('/data/testFields', getTestFieldsSuccess);

export function getTestFieldsSuccess(payload) {
    return { type: actions.availableFields.GET_TEST_FIELDS_SUCCESS, payload: payload }
};

export const getClinicalEventTypesCall = APICall('/data/clinicalEvents', getClinicalEventTypesSuccess);

export function getClinicalEventTypesSuccess(payload) {
    return { type: actions.availableFields.GET_CE_TYPES_SUCCESS, payload: payload }
};

export const getTestTypesCall = APICall('/data/testTypes', getTestTypesSuccess);

export function getTestTypesSuccess(payload) {
    return { type: actions.availableFields.GET_TEST_TYPES_SUCCESS, payload: payload }
};