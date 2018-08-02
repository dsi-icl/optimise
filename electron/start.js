/* eslint no-console: "off" */
// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const electronIsDev = require('electron-is-dev');
const path = require('path');
const net = require('net');
const spawn = require('child_process').spawn;
const optimiseConfig = require('../config/optimise.config');
const packageInfo = require('../package.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const client = new net.Socket();
let startedElectron = false;

function tryConnection(func) {
    client.connect({ port: optimiseConfig.port }, () => {
        client.end();
        if (!startedElectron) {
            func();
            startedElectron = true;
        }
    });
}

client.on('error', () => {
    setTimeout(tryConnection, 1000);
});

let apiProcess = null;

function launchBackend(success, error) {

    try {
        let cmd = [];
        if (process.env.NODE_ENV === 'development')
            cmd = packageInfo.scripts['react:head'].split(' ');
        else
            cmd = packageInfo.scripts['api:start'].split(' ');

        apiProcess = spawn(cmd.shift(), cmd, {
            cwd: path.normalize(`${__dirname}/../`),
            env: {
                BROWSER: 'none'
            }
        });

        apiProcess.stdout.on('data', function (data) {
            console.log('API Server STD: ' + data.toString());
        });

        apiProcess.stderr.on('data', function (data) {
            console.log('API Server ERR: ' + data.toString());
        });

        apiProcess.on('exit', function (code) {
            console.error('child process exited with code ' + code.toString());
        });

        tryConnection(success);
    } catch (e) {
        error(e);
    }
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    // const startUrl = process.env.ELECTRON_START_URL || url.format({
    //     pathname: path.join(__dirname, './build/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // });
    // mainWindow.loadURL(startUrl);
    mainWindow.loadFile(path.normalize(`${__dirname}/splash.html`));
    launchBackend(() => {
        mainWindow.loadURL(`http://localhost:${optimiseConfig.port}`);
    }, (error) => {
        console.error(error);
    });

    // Open the DevTools.
    if (process.env.NODE_ENV === 'development')
        mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    createWindow();
    if (electronIsDev) {
        autoUpdater.updateConfigPath = path.normalize(`${__dirname}/../dev-app-update.yml`);
    }
    autoUpdater.checkForUpdates();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
    apiProcess.kill();
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (__unused__info) => {
    mainWindow.webContents.send('updateReady');
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on('quitAndInstall', (__unused__event, __unused__arg) => {
    autoUpdater.quitAndInstall();
});
