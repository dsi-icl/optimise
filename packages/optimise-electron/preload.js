const { ipcRenderer } = require('electron');
const unhandled = require('electron-unhandled');
const packageInfo = require('./package.json');
const callStack = {};

unhandled();

window['optimiseVersion'] = packageInfo.version;
window['ipcUpdateCommander'] = () => {
    ipcRenderer.send('quitAndInstall');
};

ipcRenderer.on('update-message', function (__unused__event, message) {
    window['ipcUpdateReady'] = message.ready;
    window['ipcUpdateStatus'] = message.text;
});

ipcRenderer.on('optimiseApiResult', function (__unused__event, { cid, res }) {
    callStack[cid]({
        headers: new Headers(res.headers),
        status: res.statusCode,
        json: () => Promise.resolve(res.json)
    });
    delete callStack[cid];
});

window['ipcFetch'] = (url, options) => new Promise((resolve) => {
    let cid = `${Math.random().toString(36).substr(2, 5)}`;
    callStack[cid] = resolve;

    let files = {};
    if (options.body instanceof FormData) {
        let mdh = options.body.getAll('mdhierfile')[0];
        let llt = options.body.getAll('lltfile')[0];
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