const defaultOptions = {
    mode: 'cors',
    headers: {
        'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a',
        'content-type': 'application/json'
    },
    method: 'GET'
}

export function apiHelper(endpoint, options) {
    if (!options) {
        options = {};
    }
    const fetchOptions = { ...defaultOptions, ...options };
    return fetch(endpoint, fetchOptions)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return Promise.reject(res);
            }
        }, err => console.log(err))
}