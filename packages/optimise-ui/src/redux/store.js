import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
window.store = store.getState;

export default store;
