const ipcRenderer = require('electron').ipcRenderer;
const callStack = {};

document.addEventListener('DOMContentLoaded', function (event) {

    // const appVersion = require('electron').remote.app.getVersion();
    // document.getElementById('version').innerText = appVersion;

    ipcRenderer.on('message', function (event, text) {
        const container = document.getElementById('messages');
        const message = document.createElement('div');
        message.innerHTML = text;
        container.appendChild(message);
    })

    ipcRenderer.on('updateReady', function (event, text) {
        // changes the text of the button
        const container = document.getElementById('ready');
        container.innerHTML = "new version ready!";
        alert("new version ready!");
    })

    ipcRenderer.on('optimiseApiResult', function (event, { cid, res }) {
        callStack[cid]({
            json: () => Promise.resolve(res)
        });
        delete callStack[cid];
    })

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
    }
})