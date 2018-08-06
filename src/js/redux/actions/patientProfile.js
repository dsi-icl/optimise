import actionTypes from './listOfActions';

export const filterHistory = (filter) => ({ type: actionTypes.patientProfile.HISTORY_FILTER, filter });