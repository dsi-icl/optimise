import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import store from './js/redux/store.js';
import { Provider } from 'react-redux';
import registerServiceWorker from './js/registerServiceWorker.js';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
