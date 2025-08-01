import actionTypes from './listOfActions';

export const addAlert = body => ({ type: actionTypes.alert.ADD_ALERT, payload: body });
export const clearAlert = () => ({ type: actionTypes.alert.CLEAR_ALERT });
