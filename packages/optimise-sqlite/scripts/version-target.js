const PLATFORM = process.platform;
const ARCH = process.arch;
const MODULES = process.versions.modules;
const ELECTRON = process.versions.electron;

let NAME;
if (ELECTRON) {
    const MINOR_RELEASE = ELECTRON.match(/\d\.\d/)[0];
    if (!MINOR_RELEASE)
        throw new Error('Electron', ELECTRON, 'release not supported');
    NAME = `sqlite3-electron-v${MINOR_RELEASE}-${PLATFORM}-${ARCH}.node`;
} else {
    NAME = `sqlite3-node-v${MODULES}-${PLATFORM}-${ARCH}.node`;
}

module.exports = () => NAME;