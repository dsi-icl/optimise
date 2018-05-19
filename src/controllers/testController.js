const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class TestController {
    createTest(req, res){
        if (req.body.expectedDate && validateAndFormatDate(req.body.expectedDate)){
            let entryObj = {
                'ordered_during_visit': req.body.visitId,
                'type': req.body.type,
                'expected_occur_date': validateAndFormatDate(req.body.expectedDate)
            }
            createEntry(req, res, 'ordered_tests', entryObj, 'databaseError');
        } else {
            res.status(400).send('Please provide a date.');
        }
    }

    deleteTest(req, res){
        if (req.requester.priv === 1 && req.body.expectedDate && validateAndFormatDate(req.body.expectedDate)){
            deleteEntry(req, res, 'ordered_tests', {'ordered_during_visit': req.body.visitId, 'type': req.body.type, 'expected_occur_date': validateAndFormatDate(req.body.expectedDate)}, 'test', 1);
        }
    }
}

const _singleton = new TestController();
module.exports = _singleton;