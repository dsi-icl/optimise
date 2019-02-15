/* eslint-disable no-restricted-globals */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import App from './js/application';
import store from './js/redux/store';
import history from './js/redux/history';
// import registerServiceWorker from './js/registerServiceWorker';

if (parent)
    console.log(parent);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root'));
// registerServiceWorker();
