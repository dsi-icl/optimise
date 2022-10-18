import dbcon from '../utils/db-connection';
import formatToJSON from '../utils/format-response';

class ICD11Controller {
    static loadICD11Collection() {
        return new Promise((resolve, reject) => dbcon()('ICD11')
            .select('*')
            .then((result) => {
                ICD11Controller.setICD11Collection(result);
                return resolve();
            })
            .catch(() => {
                ICD11Controller.setICD11Collection(null);
                return reject();
            }));
    }

    static setICD11Collection(collection) {
        ICD11Controller.ICD11Collection = collection;
    }

    static async getICD11Field({ query }, res) {
        const result = [];
        const maxOccurency = 20;
        await ICD11Controller.loadICD11Collection();
        if (query.hasOwnProperty('search')) {
            let j = 0;
            for (let i = 0; i < ICD11Controller.ICD11Collection.length && j < maxOccurency; i++) {
                if (ICD11Controller.ICD11Collection[i].name.includes(query.search) || ICD11Controller.ICD11Collection[i].code.includes(query.search)) {
                    result[j] = ICD11Controller.ICD11Collection[i];
                    j++;
                }
            }
            res.status(200).json(formatToJSON(result));
            return;
        }
        if (query.hasOwnProperty('parent')) {
            let j = 0;
            for (let i = 0; i < ICD11Controller.ICD11Collection.length && j < maxOccurency; i++) {
                if (ICD11Controller.ICD11Collection[i].parent === parseInt(query.parent)) {
                    result[j] = ICD11Controller.ICD11Collection[i];
                    j++;
                }
            }
            res.status(200).json(formatToJSON(result));
            return;
        }
        else {
            res.status(200).json(formatToJSON(ICD11Controller.ICD11Collection));
            return;
        }
    }
}

export default ICD11Controller;
