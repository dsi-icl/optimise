import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers.js';

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
Window.store = store.getState;

export default store;