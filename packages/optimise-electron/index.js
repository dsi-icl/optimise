const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const express = require('express');
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const unhandled = require('electron-unhandled');
const optimiseCore = require('./dist/server').default;
const packageInfo = require('./package.json');
const { menu } = require('./src/menu');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Setup about panel
app.setAboutPanelOptions({
    applicationName: packageInfo.productName,
    applicationVersion: packageInfo.version
});

// Setup Menu
Menu.setApplicationMenu(menu);

const devMode = /electron/.test(path.basename(app.getPath('exe'), '.exe'));
if (devMode) {
    // Set appname and userData to indicate development environment
    app.setName(`${app.getName()}-dev`);
    app.setPath('userData', `${app.getPath('userData')}-dev`);

    autoUpdater.updateConfigPath = path.join(
        __dirname,
        'src/dev-app-update.yml'
    );

    // For tests, ensure that checkForUpdatesAndNotify doesn't short circuit
    if (process.env.NODE_ENV === 'test')
        Object.defineProperty(app, 'isPackaged', {
            get() {
                return true;
            }
        });

    // Setup reload
    // require('electron-reload')(path.join(__dirname, 'dist/app.js'), {
    // 	electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    // });
} else {
    unhandled();
}

const web_app = express();
const optimise_server = new optimiseCore({
    optimiseDBLocation: path.join(app.getPath('userData'), 'optimise.db')
});

let cookie;
const httpify = ({ url, options = {} }) => new Promise((resolve, reject) => {
    if (options.method === undefined) options.method = 'GET';
    if (cookie !== undefined) {
        if (options.headers === undefined) options.headers = {};
        options.headers.cookie = cookie;
    }

    let queue = '';

    const req = Object.assign(options, {
        url,
        _readableState: {},
        socket: {},
        pipe: (destination) => {
            const s = new Readable();
            s.push(queue);
            s.push(null);
            s.pipe(destination);
        },
        unpipe: function () {
            return;
        },
        connection: {
            remoteAddress: '::1'
        }
    });

    if (
        options.headers !== undefined &&
        options.headers['content-type'] &&
        options.headers['content-type'].search('multipart/form-data') >= 0
    ) {
        const boundary = `--------------------------${Math.random()
            .toString(5)
            .substr(2, 16)}`;
        let content;
        Object.keys(options.body).forEach((k) => {
            queue += `${boundary}\r\nContent-Disposition: form-data; name="${k}"; filename="${options.body[k].name}";\r\nContent-Type: text/plain\r\n\r\n`;
            content = fs.readFileSync(options.body[k].path, 'ascii');
            queue += `${content}`;
        });
        queue += `\r\n${boundary}--`;
        req.headers = req.headers || {};
        req.headers[
            'content-type'
        ] = `multipart/form-data; boundary=${boundary.substr(2)}`;
        req.headers['content-length'] = queue.length;
        req.body = queue;
    } else {
        req.body = options.body ? JSON.parse(options.body) : undefined;
    }

    const res = {
        _sent: Buffer.from(''),
        _headers: {},
        setHeader: (name, value) => {
            res._headers[name] = value;
        },
        set: (name, value) => {
            res._headers[name] = value;
        },
        getHeader: (name) => res._headers[name],
        get: (name) => res._headers[name],
        write: (chunk) => {
            res._sent = Buffer.concat([res._sent, chunk]);
        },
        end: (chunk) => {
            try {
                if (chunk !== undefined)
                    res._sent = Buffer.concat([res._sent, chunk]);
                if (Buffer.byteLength(res._sent) === 0)
                    reject({
                        error: 'Could not process relevant reponse in IPC Fetch'
                    });

                let type;
                res.writeHead(res.statusCode);
                Object.keys(res._headers).forEach((e) => {
                    if (e.toLowerCase() === 'set-cookie')
                        cookie = res._headers[e][0].split(';')[0];
                    if (e.toLowerCase() === 'content-type')
                        type = res._headers[e];
                });

                if (type.search('application/json') >= 0)
                    resolve({
                        headers: res._headers,
                        statusCode: res.statusCode,
                        json: JSON.parse(res._sent.toString())
                    });
                else {
                    resolve({
                        headers: res._headers,
                        statusCode: res.statusCode,
                        buffer: res._sent
                    });
                }
            } catch (e) {
                reject({
                    error: `An error occurred processing IPC Fetch: ${e.message}`
                });
            }
        }
    };

    web_app(req, res);
});

const createApi = () => optimise_server
    .start()
    .then((optimise_router) => {
        // Remove unwanted express headers
        web_app.set('x-powered-by', false);
        web_app.use('/api', optimise_router);

        ipcMain.on('optimiseApiCall', (event, { cid, ...parameters }) => {
            httpify(parameters)
                .then((res) =>
                    event.sender.send('optimiseApiResult', {
                        cid,
                        res
                    }))
                .catch((error) => {
                    event.sender.send('optimiseApiResult', {
                        cid,
                        error: {
                            json: {
                                ...error
                            },
                            statusCode: 500
                        }
                    });
                });
        });

        ipcMain.on('optimiseExportCall', (__unused__event, parameters) => {
            httpify(parameters).then((res) => {
                const filename = (
                    res.headers['Content-Disposition'] || ''
                ).match(/filename="(.*?)"/i);
                const options = {
                    title: 'Save export archive',
                    defaultPath: `${app.getPath('downloads')}/${filename === null || filename[1] === undefined
                        ? 'optimise-data.zip'
                        : filename[1]}`
                };
                return dialog
                    .showSaveDialog(null, options)
                    .then(({ filePath }) =>
                        new Promise((resolve, reject) => {
                            if (filePath !== undefined)
                                fs.writeFile(
                                    filePath,
                                    res.buffer,
                                    function (err) {
                                        if (err)
                                            return reject(err);
                                        return resolve();
                                    }
                                );
                        })
                    );
            })
                .catch((err) => {
                    console.error(err);
                    // eslint-disable-next-line no-alert
                    alert(err);
                });
        });

        return true;
    })
    .catch((error) => {
        console.error(
            'An error occurred while starting the Optimise core.',
            error
        ); // eslint-disable-line no-console
        console.log(error.stack);
        return false;
    });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let closingBlock = false;
let updatingBlock = false;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        toolbar: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`);

    // Open the DevTools.
    if (devMode && process.argv.indexOf('--noDevTools') === -1) {
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.setMenu(null);
    }

    mainWindow.on('close', () => {
        if (updatingBlock === false) {
            if (mainWindow !== null && closingBlock === false) {
                closingBlock = true;
                mainWindow.close();
                mainWindow = null;
            }
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') app.quit();
        }
    });
};

const sendUpdateStatusToWindow = (message) => {
    log.info(message);
    if (mainWindow) mainWindow.webContents.send('update-message', message);
};

autoUpdater.on('checking-for-update', () => {
    sendUpdateStatusToWindow({
        ready: false,
        text: 'Checking for update...'
    });
});

autoUpdater.on('update-available', () => {
    // Prompt the user if an update is available!
    dialog.showMessageBox({
        message: 'There is an update available! It is being downloaded...'
    });
    sendUpdateStatusToWindow({
        ready: false,
        text: 'There is an update available! It is being downloaded...'
    });
});

autoUpdater.on('update-not-available', () => {
    sendUpdateStatusToWindow({
        ready: false,
        text: 'Nothing to update today.'
    });
});

autoUpdater.on('error', (err) => {
    sendUpdateStatusToWindow({
        ready: false,
        text: `There was an error with the update process. ${err.message !== undefined ? err.message : ''}`
    });
});

autoUpdater.on('download-progress', (info) => {
    info = info || { percent: 0 };
    sendUpdateStatusToWindow({
        ready: false,
        text: `Update download in progress... (${parseFloat(
            info.percent
        ).toFixed(2)}%)`
    });
});

autoUpdater.on('update-downloaded', () => {
    // Promot the user to update, if update is available
    const options = {
        buttons: ['Yes', 'No'],
        message: 'Do you want to update the software now?'
    };

    dialog.showMessageBox(options).then((res) =>
        new Promise((resolve) => {
            if (res.response === 0) {
                setImmediate(() => {
                    app.removeAllListeners('window-all-closed');

                    // Silent update & force restart works only for windows
                    resolve(optimise_server
                        .stop()
                        .then(() => autoUpdater.quitAndInstall(true, true)));
                });
            }
            resolve();
        }))
        .catch((err) => {
            console.error(err);
            // eslint-disable-next-line no-alert
            alert(err);
        });

    sendUpdateStatusToWindow({
        ready: true,
        text: 'The update is ready! Click the button below to install.'
    });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
    if (process.argv.includes('--autoupdate-test')) {
        console.log('This run is for testing auto-update and fires no UI');
    } else createApi().then(createWindow)
        .catch((err) => {
            console.error(err);
            if (devMode) {
                // eslint-disable-next-line no-alert
                alert(err);
            }
        });
    setTimeout(() => autoUpdater.checkForUpdates(), 1000);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
        optimise_server.stop().then(() => app.quit())
            .catch((err) => {
                console.error(err);
                if (devMode) {
                    // eslint-disable-next-line no-alert
                    alert(err);
                }
            });
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        closingBlock = false;
        createWindow();
    }
});

ipcMain.on('quitAndInstall', () => {
    updatingBlock = true;
    setImmediate(() => {
        app.removeAllListeners('window-all-closed');
        optimise_server.stop().then(() => autoUpdater.quitAndInstall(false))
            .catch((err) => {
                console.error(err);
                if (devMode) {
                    // eslint-disable-next-line no-alert
                    alert(err);
                }
            });
    });
});

ipcMain.on('rendererIsFinished', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin' && updatingBlock === false)
        optimise_server.stop().then(() => app.quit())
            .catch((err) => {
                console.error(err);
                if (devMode) {
                    // eslint-disable-next-line no-alert
                    alert(err);
                }
            });
});
