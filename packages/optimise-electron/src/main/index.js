import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import staticPath from './utils/staticPath';

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

const createMainWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    // By default opens file:///path/to/optimise-ui/build/index.html, unless
    // there's a ENV variable set, which we will use for development.
    mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
        url.format({
        pathname: path.join(staticPath, 'client', 'index.html'),
        protocol: 'file:',
        slashes: true 
        })
    );
};

autoUpdater.on('checking-for-update', () => {
})
autoUpdater.on('update-available', (info) => {
})
autoUpdater.on('update-not-available', (info) => {
})
autoUpdater.on('error', (err) => {
})
autoUpdater.on('download-progress', (progressObj) => {
})
autoUpdater.on('update-downloaded', (info) => {
    autoUpdater.quitAndInstall();  
})

// Quit application when all windows are closed
app.on('window-all-closed', () => {
    // On macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow();
    autoUpdater.checkForUpdates();
});
