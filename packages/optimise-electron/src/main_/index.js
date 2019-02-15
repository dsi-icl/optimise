/* global __static */

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import isDev from 'electron-is-dev';

import optimiseServer from 'optimise-core/build/server';

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

if (isDev)
    autoUpdater.updateConfigPath = path.join(__static, 'dev-app-update.yml');

let win; // this wills store the window object

function createDefaultWindow() {
    win = new BrowserWindow({ width: 900, height: 680 });
    if (isDev) {
        win.webContents.openDevTools()
    }

    // if (isDev) {
    //     win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    // }

    console.log('FLORIAN HAHAHAH ??>', optimiseServer);
    win.loadURL(
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, 'ui', 'index.html'),
            protocol: 'file:',
            slashes: true,
            hash: `v${app.getVersion()}`
        })
    );

    win.on('closed', () => app.quit());
    return win;
}

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})

autoUpdater.on('update-available', (ev, info) => {
    sendStatusToWindow('Update available.');
})

autoUpdater.on('update-not-available', (ev, info) => {
    sendStatusToWindow('Update not available.');
})

autoUpdater.on('error', (ev, err) => {
    sendStatusToWindow('Error in auto-updater.');
})

autoUpdater.on('download-progress', (ev, progressObj) => {
    sendStatusToWindow('Download progress...');
})

autoUpdater.on('update-downloaded', (ev, info) => {
    sendStatusToWindow('Update downloaded; will install in 5 seconds');
});

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow()
    }
})

// create main BrowserWindow when electron is ready
app.on('ready', function () {
    createDefaultWindow();
    autoUpdater.checkForUpdates();
});

ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})
