import dbcon from '../utils/db-connection';
import formatToJSON from '../utils/format-response';
import MeddraHierarchyProcessor from '../core/MeddraHierarchyProcessor';

class MeddraController {

    static handleMeddraUploadByAdmin({ user, files }, res) {
        if (user.priv !== 1) {
            res.status(401).json({ error: 'Not authorized.' });
            return;
        }
        if (!files.mdhierfile || files.mdhierfile.length !== 1) {
            res.status(400).json({ error: 'Cannot read file.' });
            return;
        }

        const mdhierfile = files.mdhierfile[0];
        const lltfile = files.lltfile && files.lltfile[0];

        let result;
        try {
            const processor = new MeddraHierarchyProcessor(mdhierfile, lltfile);
            processor.parsebuffer();
            result = processor.transformData();
        } catch (e) {
            res.status(400).json({ error: e });
            return null;
        }

        dbcon().batchInsert('ADVERSE_EVENT_MEDDRA', result, 10)
            .then(() => {
                res.status(200).json({ message: 'Meddra uploaded.' });
                MeddraController.loadMeddraCollection();
                return null;
            })
            .catch(err => { res.status(500).json({ error: err.toString() }); });
    }

    static loadMeddraCollection() {
        return new Promise((resolve, reject) => dbcon()('ADVERSE_EVENT_MEDDRA')
            .select('*')
            .then((result) => {
                MeddraController.setMeddraCollection(result);
                return resolve();
            })
            .catch(() => {
                MeddraController.setMeddraCollection(null);
                return reject();
            }));
    }

    static setMeddraCollection(collection) {
        MeddraController.MeddraCollection = collection;
    }

    static async getMeddraField({ query }, res) {
        let result = [];
        let maxOccurency = 20;
        await MeddraController.loadMeddraCollection();
        if (query.hasOwnProperty('search')) {
            let j = 0;
            for (let i = 0; i < MeddraController.MeddraCollection.length && j < maxOccurency; i++) {
                if (MeddraController.MeddraCollection[i].name.includes(query.search) || MeddraController.MeddraCollection[i].code.includes(query.search)) {
                    result[j] = MeddraController.MeddraCollection[i];
                    j++;
                }
            }
            res.status(200).json(formatToJSON(result));
            return;
        }
        if (query.hasOwnProperty('parent')) {
            let j = 0;
            for (let i = 0; i < MeddraController.MeddraCollection.length && j < maxOccurency; i++) {
                if (MeddraController.MeddraCollection[i].parent === parseInt(query.parent)) {
                    result[j] = MeddraController.MeddraCollection[i];
                    j++;
                }
            }
            res.status(200).json(formatToJSON(result));
            return;
        }
        else {
            res.status(200).json(formatToJSON(MeddraController.MeddraCollection));
            return;
        }
    }
}

export default MeddraController;
