import ErrorHelper from '../utils/error_helper';
import syncCore from '../core/syncCore';

class SyncController {

    static createSync({ body }, res) {
        res.status(200).json({
            status: 'success'
        });
    }

    static checkSync(__unused__req, res) {
        res.status(200).json({
            status: 'ready'
        });
    }
}

export default SyncController;