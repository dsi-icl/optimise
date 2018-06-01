import { listOfPatients } from '../example-data-for-dev/listOfPatients';   //only for dev

const initialState = {
    matchedNames: []
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SEARCH_PATIENTS_BY_ID':
            //////only for dev/////
            const re = new RegExp(`.*${action.payload}.*`);
            const matchedPatients = listOfPatients.filter(name => re.test(name));
            ///////////////////////
            return {...state, matchedNames: matchedPatients};
        default:
            return state;
    }
};