const { Menu } = require('electron');
const { autoUpdater } = require('electron-updater');

const menu = Menu.buildFromTemplate([
    {
        label: 'Optimise',
        submenu: [
            {
                role: 'about'
            },
            {
                label: 'Check for updates',
                click: function () {
                    autoUpdater.checkForUpdates();
                }
            },

            { role: 'quit' }
        ]
    }
]);

module.exports = { menu };
