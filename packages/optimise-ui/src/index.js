/* eslint-disable no-restricted-globals */

import React, { StrictMode } from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
// import { Router } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './application';
import store from './redux/store';
import history from './redux/history';
import * as webWorker from './webWorker';
import * as serviceWorker from './serviceWorker';
import { createMemoryHistory } from 'history';

webWorker.start();
serviceWorker.unregister();

if (window && window.process) {
    window.process.on('uncaughtException', function (error) {
        // eslint-disable-next-line no-console
        console.error('Something went really wrong', error);
    });
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
// const history = createMemoryHistory();

console.log('history.location')
console.log(history)
console.log(store)

root.render(
    <StrictMode>
        <Provider store={store}>
            <HelmetProvider>
                <Router location={history.location} navigator={history}>
                    <App />
                </Router>
            </HelmetProvider>
        </Provider>
    </StrictMode>

);

//<Router location={history.location} navigator={history}>

// root.render(
//     <StrictMode>
//         <Provider store={store}>
//             <HelmetProvider>
//                 <Router useLocation={history.location} >
//                     <App />
//                 </Router>
//             </HelmetProvider>
//         </Provider>
//     </StrictMode>
// );

// ReactDOM.render(
//     <StrictMode>
//         <Provider store={store}>
//             <Router history={history}>
//                 <HelmetProvider>
//                     <App />
//                 </HelmetProvider>
//             </Router>
//         </Provider>
//     </StrictMode>,
//     document.getElementById('root'));
