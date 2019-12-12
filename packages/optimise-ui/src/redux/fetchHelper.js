import merge from 'deepmerge';
import isPlainObject from 'is-plain-object';
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

let tokenCSRF = undefined;

export const apiHelper = (endpoint, options, blockError) => {
    if (!options) {
        options = {};
    }

    const fetchOptions = {
        ...merge.all([defaultOptions, options, tokenCSRF ? {
            headers: {
                'csrf-token': tokenCSRF
            }
        } : {}], {
            isMergeableObject: isPlainObject
        })
    };

    if (fetchOptions.headers['content-type'] === 'custom/delete')
        delete fetchOptions.headers['content-type'];

    let returnValue;

    try {

        let fetcher = window.ipcFetch || window.fetch;

        returnValue = fetcher(`/api${endpoint}`, fetchOptions)
            .then(res => {
                const tokenCSRFHeader = res.headers.get('csrf-token');
                if (tokenCSRFHeader)
                    tokenCSRF = tokenCSRFHeader;
                return res.json().then(json => ({
                    status: res.status,
                    data: json
                }));
            }, err => ({ status: 900, data: { error: err } }))
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