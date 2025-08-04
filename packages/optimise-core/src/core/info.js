import packageInfo from '../../package.json';

class InfoCore {
    static getInfo() {
        return new Promise(resolve => resolve({
            version: packageInfo.version
        }));
    }
}

export default InfoCore;
