import actionTypes from './listOfActions';
import { apiHelper } from '../fetchHelper';

export const searchMedDRARequest = searchString => ({ type: actionTypes.searchMedDRA.SEARCH_MEDDRA_REQUEST, payload: searchString });
export const searchMedDRAFailure = patientId => ({ type: actionTypes.searchMedDRA.SEARCH_MEDDRA_FAILURE, payload: patientId });
export const searchMedDRASuccess = data => ({ type: actionTypes.searchMedDRA.SEARCH_MEDDRA_SUCCESS, payload: data });

export const searchMedDRAAPICall = (searchString) => dispatch => {
    dispatch(searchMedDRARequest());
    return apiHelper(`/meddra?search=${searchString}`)
        .then(json => {
            dispatch(searchMedDRASuccess(json));
        })
        .catch(() => { dispatch(searchMedDRAFailure(searchString)); });
};