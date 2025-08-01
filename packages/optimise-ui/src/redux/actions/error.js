import actionTypes from './listOfActions';

export const addError = body => ({ type: actionTypes.appLevelError.ADD_ERROR, payload: body });
export const clearError = () => ({ type: actionTypes.appLevelError.CLEAR_ERROR });
