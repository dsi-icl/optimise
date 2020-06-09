import dbcon from '../utils/db-connection';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';

class AvailableFieldController {
    static getFields({ params, query }, res) {     //bound to GETclinicalEvents and GETtestTypes too
        const tableMap = {
            'visitFields': 'AVAILABLE_FIELDS_VISITS',
            'visitSections': 'AVAILABLE_VISIT_SECTIONS',
            'testFields': 'AVAILABLE_FIELDS_TESTS',
            'ceFields': 'AVAILABLE_FIELDS_CE',
            'clinicalEvents': 'AVAILABLE_CLINICAL_EVENT_TYPES',
            'testTypes': 'AVAILABLE_TEST_TYPES',
            'diagnoses': 'AVAILABLE_DIAGNOSES',
            'concomitantMedsList': 'AVAILABLE_CONCOMITANT_MED'
        };
        let moduleObj = {};
        if (tableMap[params.dataType]) {
            if (params.dataType === 'visitFields' && query.module) {
                moduleObj = { module: query.module };
            }
            let table = tableMap[params.dataType];
            dbcon()(table)
                .select('*')
                .where(moduleObj)
                .then((result) => {
                    if (result.length > 0) {
                        for (let i = 0; i < result.length; i++) {
                            delete result[i].deleted;
                        }
                    }
                    res.status(200).json(formatToJSON(result));
                    return true;
                }).catch((error) => {
                    res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                    return false;
                });
            return;
        }
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
    }
}

export default AvailableFieldController;