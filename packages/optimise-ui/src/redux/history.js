import { createBrowserHistory } from 'history';

export default createBrowserHistory({
    // Because we use Router in react-route-dom instead of MemoryRouter we need to set the base of the URL to the resource folder on the hard drive.
    // This allows images and other resources to load relative to their actual location
    basename: window.ipcFetch !== undefined ? window.location.pathname.slice(0, 0 - 'index.html'.length) : undefined
});