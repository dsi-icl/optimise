import SelectorUtils from '../utils/selector-utils';
import { v4 as uuid } from 'uuid';
import {
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntry,
} from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';

const pregnancyModel = {
    aliasId: '',
    study: '',
};

/**
 * @description Patient Core allow to get, search, create and delete a patient
 */
class Pregnancy {
    static getPatientProfileById(whereObj) {
        return new Promise((resolve, reject) => {
            getEntry('PATIENT_PREGNANCY', whereObj, {
                id: 'id',
                patient: 'patient',
                startDate: 'startDate',
                outcome: 'outcome',
                outcomeDate: 'outcomeDate',
                meddra: 'meddra',
                deleted: 'deleted',
            })
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    }

    static getPregnancyDataById(whereObj) {
        return new Promise((resolve, reject) => {
            getEntry('PATIENT_PREGNANCY_DATA', whereObj)
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    }

    /**
     * @function getPatientPregnanciesById
     * @description Return joined pregnancies
     */
    static async getPatientPregnanciesById({ params }, res) {
        const patientId = params.patientId;
        const whereObj = {
            patient: patientId,
        };

        try {
            const pregnancies = await Pregnancy.getPatientProfileById(whereObj);
            for (let item of pregnancies) {
                const data = await Pregnancy.getPregnancyDataById({
                    pregnancyId: item.id,
                });
                item.dataEntries = data;
            }

            res.send(pregnancies);
        } catch (error) {
            res.send({ error });
        }
    }

    /**
     * @description Create a new pregnancy data
     * @param {*} body The new created patient
     * @param {*} res express response object
     */
    static createPregnancyData({ body }, res) {
        let entryObj = body;

        createEntry('PATIENT_PREGNANCY_DATA', entryObj)
            .then((result) =>
                res.send({
                    message: message.successMessages.CREATED,
                    id: result,
                })
            )
            .catch((error) =>
                res.send({ messge: message.errorMessages.CREATIONFAIL, error })
            );
    }

    /**
     * @description Update a new patient
     * @param {*} user Information about the user
     * @param {*} patient The new created patient
     */
    static updatePatient(user, patientObj) {
        return new Promise((resolve, reject) =>
            updateEntry(
                'PATIENTS',
                user,
                '*',
                { id: patientObj.id },
                patientObj
            )
                .then((result) => resolve(result))
                .catch((error) =>
                    reject(
                        ErrorHelper(message.errorMessages.CREATIONFAIL, error)
                    )
                )
        );
    }

    /**
     * @function deletePatient delete an entry of Patient from an ID.
     *
     * @param {*} user Information about the user
     * @param {*} idObj ID of the entry that is going to be deleted
     */
    static deletePatient(user, idObj) {
        return new Promise((resolve, reject) =>
            deleteEntry('PATIENTS', user, idObj)
                .then((success) => resolve(success))
                .catch((error) =>
                    reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))
                )
        );
    }
}

export default Pregnancy;
