const defaultOptions = {
    mode: 'cors',
    headers: {
        'content-type': 'application/json'
    },
    method: 'GET',
    credentials: 'include'
};

export function apiHelper(endpoint, options) {
    if (!options) {
        options = {};
    }
    const fetchOptions = { ...defaultOptions, ...options };
    return fetch(`/api${endpoint}`, fetchOptions)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return Promise.reject(res);
            }
        }, err => err.json());
}