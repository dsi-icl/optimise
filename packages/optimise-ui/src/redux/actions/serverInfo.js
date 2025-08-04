import { addError } from './error';
import store from '../store';
import actions from './listOfActions';
import { apiHelper } from '../fetchHelper';

export const APICall = (endpoint, cbDispatch) => () => dispatch => apiHelper(endpoint)
    .then((json) => {
        dispatch(cbDispatch(json));
    })
    .catch(msg => store.dispatch(addError({ error: msg })));

export const getServerInfoSuccess = payload => ({ type: actions.serverInfo.GET_SERVER_INFO_SUCCESS, payload: payload });
export const getServerInfoCall = APICall('/info', getServerInfoSuccess);
