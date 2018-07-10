import actions from './listOfActions.js';

export function APICall(endpoint, cbDispatch) {
    return function(body){
        return function(dispatch){ 
            return fetch(endpoint, {
                mode: 'cors',
                headers: { 'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a', //change later
                    'content-type': 'application/json' },  
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
                .catch(res => res.text().then(msg => console.log(msg)))
        }
    }
};

export const getDrugsCall = APICall('/api/treatments/drugs', getDrugsSuccess)

export function getDrugsSuccess(payload) {
    return { type: actions.availableFields.GET_DRUGS_SUCCESS, payload: payload }
}

export const getVisitFieldsCall = APICall('/api/available/visitFields', getVisitFieldsSuccess);

export function getVisitFieldsSuccess(payload) {
    return { type: actions.availableFields.GET_VISIT_FIELDS_SUCCESS, payload: payload }
};

export const getTestFieldsCall = APICall('/api/available/testFields', getTestFieldsSuccess);

export function getTestFieldsSuccess(payload) {
    return { type: actions.availableFields.GET_TEST_FIELDS_SUCCESS, payload: payload }
};

export const getClinicalEventTypesCall = APICall('/api/available/clinicalEvents', getClinicalEventTypesSuccess);

export function getClinicalEventTypesSuccess(payload) {
    return { type: actions.availableFields.GET_CE_TYPES_SUCCESS, payload: payload }
};

export const getTestTypesCall = APICall('/api/available/testTypes', getTestTypesSuccess);

export function getTestTypesSuccess(payload) {
    return { type: actions.availableFields.GET_TEST_TYPES_SUCCESS, payload: payload }
};