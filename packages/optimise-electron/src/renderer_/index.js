// Initial welcome page. Delete the following line to remove it.
'use strict';

// self.addEventListener('fetch', function (event) {
//     console.log(event);
// });

fetch = () => new Promise(function (resolve) {

    // let Express handle the request, but get the result
    console.log(myName, 'handle request', JSON.stringify(parsedUrl, null, 2))

    event.request.clone().text().then(function (text) {
        var body = text
        if (isFormPost(event.request)) {
            body = formToObject(text)
        }

        var req = {
            url: parsedUrl.href,
            method: event.request.method,
            body: body,
            headers: {
                'content-type': event.request.headers.get('content-type')
            },
            unpipe: function () { },
            connection: {
                remoteAddress: '::1'
            }
        }
        // console.log(req)
        var res = {
            _headers: {},
            setHeader: function setHeader(name, value) {
                // console.log('set header %s to %s', name, value)
                this._headers[name] = value
            },
            getHeader: function getHeader(name) {
                return this._headers[name]
            },
            get: function get(name) {
                return this._headers[name]
            }
        }

        function endWithFinish(chunk, encoding) {
            console.log('ending response for request', req.url)
            console.log('output "%s ..."', chunk.toString().substr(0, 10))
            console.log('%d %s %d', res.statusCode || 200,
                res.get('Content-Type'),
                res.get('Content-Length'))
            // end.apply(res, arguments)
            const responseOptions = {
                status: res.statusCode || 200,
                headers: {
                    'Content-Length': res.get('Content-Length'),
                    'Content-Type': res.get('Content-Type')
                }
            }
            if (res.get('Location')) {
                responseOptions.headers.Location = res.get('Location')
            }
            if (res.get('X-Powered-By')) {
                responseOptions.headers['X-Powered-By'] = res.get('X-Powered-By')
            }
            resolve(new Response(chunk, responseOptions))
        }

        res.end = endWithFinish
        app(req, res)
    })
});

const ipcRenderer = require('electron').ipcRenderer;

document.addEventListener('DOMContentLoaded', function (event) {

    const appVersion = require('electron').remote.app.getVersion();
    document.getElementById('version').innerText = appVersion;

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

    const styles = document.createElement('style');
    styles.innerText = `
        html, body {
            height: 100%;
            width: 100%;
            overflow: hidden;
        }

        #ui {
            position: absolute;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
            border: none;
        }
    `;
    document.head.appendChild(styles);

    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = `
        <div>
            <iframe id="ui" src="./ui/"/>
        </div>
    `;
})