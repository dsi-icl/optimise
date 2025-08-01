window.global = window;
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

if (window && window.process && typeof window.process.on === 'function') {
    window.process.on('uncaughtException', function (error) {
        console.error('Something went really wrong', error);
    });
}

const container = document.getElementById('root');
const rootStruct = (
    <StrictMode>
        <Provider store={store}>
            <Router history={history}>
                <HelmetProvider>
                    <App />
                </HelmetProvider>
            </Router>
        </Provider>
    </StrictMode>
);

if (!container) {
    throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(rootStruct);
