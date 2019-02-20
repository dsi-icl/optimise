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

    if ((process || (window || {}).process) !== undefined && window.ipcFetch === undefined)
        return new Promise((resolve) => {
            let id = setTimeout(() => {
                clearTimeout(id);
                resolve(apiHelper(endpoint, options, blockError));
            }, 200);
        });

    let fetcher = window.ipcFetch || window.fetch;
    return fetcher(`/api${endpoint}`, fetchOptions)
        .then(res =>
            res.json().then((json) => ({
                status: res.status,
                data: json
            })), err => store.dispatch(addError({ error: err })))
        .then(json => {
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
};