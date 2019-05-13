/* eslint-disable no-restricted-globals */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';
import App from './application';
import store from './redux/store';
import history from './redux/history';
import * as webWorker from './webWorker';
import * as serviceWorker from './serviceWorker';

webWorker.start();
serviceWorker.unregister();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </Router>
    </Provider>,
    document.getElementById('root'));
