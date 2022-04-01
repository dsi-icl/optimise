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
import moment from 'moment';

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

    static getPregnancyImagingDataById(whereObj) {
        return new Promise((resolve, reject) => {
            getEntry('PATIENT_PREGNANCY_IMAGING', whereObj)
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
    static createPregnancyData({ params, body }, res) {
        let entryObj = {
            pregnancyId: params.pregnancyId,
            deleted: '-',
            date: moment().toISOString(),
            EDD: body.EDD,
            LMP: body.LMP,
            weight: body.weight,
            height: body.height,
            illicitDrugUse: body.illicitDrugUse,
            folicAcidSuppUsedStartDate: body.folicAcidSuppUsedStartDate,
            folicAcidSuppUsed: body.folicAcidSuppUsed,
            numOfFoetuses: body.numOfFoetuses,
            ART: body.ART,
            maternalAgeAtLMP: body.maternalAgeAtLMP,
            dataType: body.dataType,
            maternalBMI: body.maternalBMI,
            inductionOfDelivery: body.inductionOfDelivery,
            lengthOfPregnancy: body.lengthOfPregnancy,
            pregnancyOutcome: body.pregnancyOutcome,
            congenitalAbnormality: body.congenitalAbnormality,
            modeOfDelivery: body.modeOfDelivery,
            useOfEpidural: body.useOfEpidural,
            birthWeight: body.birthWeight,
            sexOfBaby: body.sexOfBaby,
            APGAR0: body.APGAR0,
            APGAR5: body.APGAR5,
            everBreastFed: body.everBreastFed,
            breastfeedStart: body.breastfeedStart,
            exclusiveBreastfeedEnd: body.exclusiveBreastfeedEnd,
            mixedBreastfeedEnd: body.mixedBreastfeedEnd,
            admission12: body.admission12,
            admission36: body.admission36,
            admission60: body.admission60,
            developmentalOutcome: body.developmentalOutcome
        };


        createEntry('PATIENT_PREGNANCY_DATA', entryObj)
            .then(async (result) => {
                for (let item of body.imagingData) {
                    let imageData = {
                        pregnancyDataId: result[0],
                        deleted: '-',
                        ...item
                    };

                    await createEntry('PATIENT_PREGNANCY_IMAGING', imageData);
                }

                return res.send({
                    message: message.dataMessage.SUCCESS,
                    id: result,
                })
            }
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
     * @function deletePregnanyData delete an entry of Patient from an ID.
     *
     * @param {*} user Information about the user
     * @param {*} idObj ID of the entry that is going to be deleted
     */
    static deletePregnancyData({ params, user }, res) {
        const id = params.pregnancyDataId;
        deleteEntry('PATIENT_PREGNANCY_DATA', user, { id })
            .then((success) => res.send({ success }))
            .catch((error) =>
                res.send(ErrorHelper(message.errorMessages.DELETEFAIL, error))
            );
    }
}

export default Pregnancy;
