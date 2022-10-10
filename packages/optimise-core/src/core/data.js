import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import dbcon from '../utils/db-connection';

class Data {

    static deleteData({ id }, { dataTable, dataTableForeignKey }, idData, deleteObj) {
        return new Promise((resolve, reject) => {
            dbcon().transaction(trx => {
                dbcon()(dataTable)
                    .where('field', 'in', deleteObj)
                    .andWhere('deleted', '-')
                    .andWhere(dataTableForeignKey, idData)
                    .update({ deleted: `${id}@${(new Date()).getTime()}` })
                    .transacting(trx)
                    .then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error)))
                    .then(trx.commit)
                    .catch(trx.rollback);
            });
        });
    }
}

export default Data;