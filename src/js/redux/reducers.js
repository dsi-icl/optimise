const initialState = {
    matchedNames: []
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SEARCH_PATIENTS_BY_ID':
            return state;
        default:
            return state;
    }
};