import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import store from './js/redux/store.js';
import { Provider } from 'react-redux';
import registerServiceWorker from './js/registerServiceWorker.js';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById('root'));
registerServiceWorker();
