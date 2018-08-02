import { addError } from './actions/error';
import store from './store';

const defaultOptions = {
    mode: 'cors',
    headers: {
        'content-type': 'application/json'
    },
    method: 'GET',
    credentials: 'include'
};

export function apiHelper(endpoint, options, blockError) {
    if (!options) {
        options = {};
    }
    const fetchOptions = { ...defaultOptions, ...options };
    return fetch(`/api${endpoint}`, fetchOptions)
        .then(res =>
            res.json().then((json) => ({
                status: res.status,
                data: json
            })),
            err => console.log(err))
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
}