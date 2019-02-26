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

        let files = {}
        if (options.body instanceof FormData) {
            let mdh = options.body.getAll('mdhierfile')[0];
            let llt = options.body.getAll('lltfile')[0];
            if (mdh !== undefined)
                files.mdhierfile = {
                    name: mdh.name,
                    path: mdh.path,
                    size: mdh.size
                }
            if (llt !== undefined)
                files.lltfile = {
                    name: llt.name,
                    path: llt.path,
                    size: llt.size
                }
            options.body = files;
        }
        ipcRenderer.send('optimiseApiCall', {
            cid,
            url,
            options
        })
    })
};

window['ipcOpen'] = (url) => {
    ipcRenderer.send('optimiseExportCall', {
        url
    })
}