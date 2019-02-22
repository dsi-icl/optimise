const { ipcRenderer } = require('electron');
const callStack = {};

window['ipcUpdateCommander'] = () => {
    ipcRenderer.send('quitAndInstall');
};

ipcRenderer.on('updateReady', function (event, text) {
    window['ipcUpdateReady'] = text;
});

ipcRenderer.on('message', function (event, text) {
    window['ipcUpdateStatus'] = text;
});

ipcRenderer.on('optimiseApiResult', function (event, { cid, res }) {
    callStack[cid]({
        json: () => Promise.resolve(res)
    });
    delete callStack[cid];
});

window['ipcFetch'] = (url, options) => {
    return new Promise((resolve) => {
        let cid = `${Math.random().toString(36).substr(2, 5)}`;
        callStack[cid] = resolve;
        ipcRenderer.send('optimiseApiCall', {
            cid,
            url,
            options
        })
    })
};