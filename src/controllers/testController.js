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

    addActualOccurredDate(req, res){
        if (req.body.visitId && req.body.type && req.body.expectedDate && validateAndFormatDate(req.body.expectedDate) && req.body.actualOccurredDate && validateAndFormatDate(req.body.actualOccurredDate)){
            knex('ordered_tests')
                .where({'ordered_during_visit': req.body.visitId, 'type': req.body.type, 'expected_occur_date': validateAndFormatDate(req.body.expectedDate)})
                .update({'actual_occurred_date': validateAndFormatDate(req.body.actualOccurredDate)})
                .then(result => {
                    if (result === 1){
                        res.status(200).json(result);
                    } else if (result === 0) {
                        res.status(404).send('cannot find your entry');
                    } else {
                        res.status(500).send('error');
                    }
                })
                .catch(err => {console.log(err);
                    res.status(500).send(err);
                });
        } else {
            res.status(400).send('malformed request.');
        }
    }

    deleteTest(req, res){
        if (req.requester.priv === 1 && req.body.testID){
            deleteEntry(req, res, 'ordered_tests', {'id': req.body.testID}, 'test', 1);
        }
    }
}

const _singleton = new TestController();
module.exports = _singleton;