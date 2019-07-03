import { addError } from './actions/error';
import store from './store';

const defaultOptions = {
    mode: 'cors',
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
    },
    method: 'GET',
    credentials: 'include'
};

export const apiHelper = (endpoint, options, blockError) => {
    if (!options) {
        options = {};
    }
    const fetchOptions = { ...defaultOptions, ...options };
    let returnValue;

    try {

        let fetcher = window.ipcFetch || window.fetch;

        returnValue = fetcher(`/api${endpoint}`, fetchOptions)
            .then(res =>
                res.json().then(json => ({
                    status: res.status,
                    data: json
                })), err => ({
                    status: 900,
                    data: {
                        error: err
                    }
                }))
            .then(json => {
                if (json.status === undefined || json.data === undefined) {
                    store.dispatch(addError({ error: 'Unknown fatal error has occured' }));
                    return Promise.reject(json);
                }
                if (json.status === 200) {
                    return json.data;
                } else {
                    if (json.data.message === 'Please login first')
                        return window.location.reload();
                    if (json.data.error && json.data.error !== 'An unknown unicorn') {
                        if (!blockError)
                            store.dispatch(addError(json.data));
                        return Promise.reject(json);
                    } else {
                        return json.data;
                    }
                }
            });
    } catch (e) {
        store.dispatch(addError({
            error: e
        }));
        returnValue = Promise.reject({
            error: e
        });
    }
    return returnValue;
};