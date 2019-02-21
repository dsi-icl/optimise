'use strict';

const path = require('path');
const express = require('express');
const { app, BrowserWindow, ipcMain } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const optimiseCore = require('./dist/server').default;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let waitBeforeClose = false;

const devMode = /electron/.test(path.basename(app.getPath('exe'), '.exe'));
if (devMode) {

	// Set appname and userData to indicate development environment
	app.setName(app.getName() + '-dev');
	app.setPath('userData', app.getPath('userData') + '-dev');

	autoUpdater.updateConfigPath = path.join(__dirname, 'src/dev-app-update.yml');

	// Setup reload
	// require('electron-reload')(path.join(__dirname, 'dist/app.js'), {
	// 	electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
	// });
}

const web_app = express();
const optimise_server = new optimiseCore({
	optimiseDBLocation: path.join(app.getPath('userData'), 'optimise.db')
});

let cookie;
const httpify = ({ url, options = {} }) => {
	return new Promise((resolve, reject) => {

		if (cookie !== undefined) {
			if (options.headers === undefined)
				options.headers = {};
			options.headers.cookie = cookie;
		}

		const req = Object.assign(options, {
			url,
			body: options.body ? JSON.parse(options.body) : undefined,
			unpipe: function () { },
			connection: {
				remoteAddress: '::1'
			}
		});

		const res = {
			_sent: '',
			_headers: {},
			setHeader: (name, value) => {
				res._headers[name] = value
			},
			getHeader: (name) => {
				return res._headers[name]
			},
			get: (name) => {
				return res._headers[name]
			},
			write: (chunk) => {
				res._sent += chunk.toString();
			},
			end: (chunk, __unused__encoding) => {

				res._sent += chunk.toString();
				if (res._sent === '')
					reject({ error: 'Could not process relevant reponse in IPC Fetch' });

				res.writeHead(res.statusCode);
				Object.keys(res._headers).forEach((e) => {
					if (e.toLowerCase() === 'set-cookie')
						cookie = res._headers[e][0].split(';')[0];
				})

				resolve(JSON.parse(res._sent));
			},
		};

		web_app(req, res)
	})
}

const createApi = () => {
	return optimise_server.start().then((optimise_router) => {
		// Remove unwanted express headers
		web_app.set('x-powered-by', false);
		web_app.use('/api', optimise_router);

		ipcMain.on('optimiseApiCall', (event, { cid, ...parameters }) => {
			httpify(parameters).then((res) => {
				event.sender.send('optimiseApiResult', {
					cid,
					res
				})
			})
		})

		return true;
	}).catch((error) => {
		console.error('An error occurred while starting the Optimise core.', error); // eslint-disable-line no-console
		console.log(error.stack);
		return false;
	});
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let createWindow = () => {

	// Create the browser window.
	mainWindow = new BrowserWindow({ show: false });
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	});

	mainWindow.maximize();

	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/dist/index.html');

	// Open the DevTools.
	if (devMode && process.argv.indexOf('--noDevTools') === -1) {
		mainWindow.webContents.openDevTools();
	}

	ipcMain.on('rendererIsFinished', (message) => {
		waitBeforeClose = false;
		app.quit();
	})

	mainWindow.on('close', (event) => {
		if (waitBeforeClose) {
			mainWindow.webContents.send('closing');
			event.preventDefault();
		}
	})

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
		app.quit();
	});
}

const sendStatusToWindow = (text) => {
	log.info(text);
	if (mainWindow)
		mainWindow.webContents.send('message', text);
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
	createApi().then(createWindow);
	setTimeout(() => autoUpdater.checkForUpdates(), 1000)
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		optimise_server.stop().then(app.quit());
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow();
});

ipcMain.on('quitAndInstall', (event, arg) => {
	autoUpdater.quitAndInstall();
})