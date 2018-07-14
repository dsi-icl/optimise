import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/application';
import store from './js/redux/store.js';
import { Provider } from 'react-redux';
import registerServiceWorker from './js/registerServiceWorker.js';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
