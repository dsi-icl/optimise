import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import store from './js/redux/store.js';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});
