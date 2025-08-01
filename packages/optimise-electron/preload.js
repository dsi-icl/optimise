const { ipcRenderer } = require('electron');
const unhandled = require('electron-unhandled');
const packageInfo = require('./package.json');
const callStack = {};

unhandled({
    showDialog: process.argv.indexOf('--devTools') !== -1
});

window['optimiseVersion'] = packageInfo.version;
window['ipcUpdateCommander'] = () => {
    ipcRenderer.send('quitAndInstall');
};

ipcRenderer.on('update-message', function (__unused__event, message) {
    window['ipcUpdateReady'] = message.ready;
    window['ipcUpdateStatus'] = message.text;
});

ipcRenderer.on('alert', function (__unused__event, message) {
    alert(message);
});

ipcRenderer.on('optimiseApiResult', function (__unused__event, { cid, res }) {
    callStack[cid]({
        headers: new Headers(res?.headers ?? {}),
        status: res?.statusCode ?? 500,
        json: () => Promise.resolve(res?.json ?? { error: 'An error occurred querying the API' })
    });

    delete callStack[cid];
});

window['ipcFetch'] = (url, options) => new Promise((resolve) => {
    const cid = `${Math.random().toString(36).substr(2, 5)}`;
    callStack[cid] = resolve;

    const files = {};
    if (options.body instanceof FormData) {
        const mdh = options.body.getAll('mdhierfile')[0];
        const llt = options.body.getAll('lltfile')[0];
        if (mdh !== undefined)
            files.mdhierfile = {
                name: mdh.name,
                path: mdh.path,
                size: mdh.size
            };
        if (llt !== undefined)
            files.lltfile = {
                name: llt.name,
                path: llt.path,
                size: llt.size
            };
        options.body = files;
        options.headers = options.headers || {};
        options.headers['content-type'] = 'multipart/form-data';
    }
    ipcRenderer.send('optimiseApiCall', {
        cid,
        url,
        options
    });
});

window['ipcOpen'] = (url) => {
    ipcRenderer.send('optimiseExportCall', {
        url
    });
};
