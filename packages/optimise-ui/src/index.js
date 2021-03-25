/* eslint-disable no-restricted-globals */

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';
import App from './application';
import store from './redux/store';
import history from './redux/history';
import * as webWorker from './webWorker';
import * as serviceWorker from './serviceWorker';
import { PregnancyBaselineDataForm } from './components/pregnancyForms/pregBaselineData';

webWorker.start();
serviceWorker.unregister();

if (window && window.process) {
    window.process.on('uncaughtException', function (error) {
        // eslint-disable-next-line no-console
        console.error('Something went really wrong', error);
    });
}

ReactDOM.render(
    <StrictMode>
        <Provider store={store}>
            <Router history={history}>
                <HelmetProvider>
                    <App />
                </HelmetProvider>
            </Router>
        </Provider>
    </StrictMode>,
    document.getElementById('root'));
