const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class DataController {
    addVisitData(req, res){             //see if I should make an api that accepts updating multiple fields instead
        if (req.body.visit){
            knex('visits')
                .select('id')
                .where({id: req.body.visit, deleted: 0})
                .then(result => {
                    if (result.length === 1)  {
                        knex('available_fields_visits')
                            .select('type', 'permitted_values')
                            .where('id', req.body.field)
                            .then(result => {
                                if (result.length === 1){
                                    switch (result[0].type) {
                                        case 'B':
                                            if (req.body.value === 1 || req.body.value === 0) {
                                                createEntry(req, res, 'visit_collected_data', req.body, 'Error. Malformed request.');
                                            } else {res.status(400).send('This field only accept value 1 and 0.')}
                                            break
                                        case 'C':
                                            if (result[0]['permitted_values'].split(', ').indexOf(req.body.value) !== -1) {  //see if the value is in the permitted values
                                                createEntry(req, res, 'visit_collected_data', req.body, 'Error. Malformed request.');
                                            } else {
                                                res.status(400).send(`This field only accept values ${result[0]['permitted_values']}`)}
                                            break
                                        case 'I':
                                            if (parseInt(req.body.value)) {
                                                createEntry(req, res, 'visit_collected_data', req.body, 'Error. Malformed request.');
                                            } else {res.status(400).send(`This field only accept integer`)}
                                            break
                                        case 'N':
                                            if (parseFloat(req.body.value)) {
                                                createEntry(req, res, 'visit_collected_data', req.body, 'Error. Malformed request.');
                                            } else {res.status(400).send(`This field only accept number`)}
                                            break
                                    }
                                } else {
                                    res.status(404).send('cannot seem to find your field');
                                }
                            })
                    } else {
                        res.status(404).send('seems like the visit does not exist!');
                    }
                })
        } else {
            res.status(400).send('please provide visit id as key "visit"');
        }
    }

    addTestData(req, res){
        if (req.body.test){
            knex('ordered_tests')
                .select('id', 'type')
                .where({id: req.body.test, deleted: 0})
                .then(result1 => {
                    if (result1.length === 1)  {
                        knex('available_fields_tests')
                            .select('type', 'permitted_values', 'test_type')
                            .where('id', req.body.field)
                            .then(result2 => {
                                if (result2.length === 1 && result1[0].type === result2[0]['test_type']){
                                    switch (result2[0].type) {
                                        case 'B':
                                            if (req.body.value === 1 || req.body.value === 0) {
                                                createEntry(req, res, 'test_data', req.body, 'Error. Malformed request.');
                                            } else {res.status(400).send('This field only accept value 1 and 0.')}
                                            break
                                        case 'C':
                                            if (result2[0]['permitted_values'].split(', ').indexOf(req.body.value) !== -1) {  //see if the value is in the permitted values
                                                createEntry(req, res, 'test_data', req.body, 'Error. Malformed request.');
                                            } else {
                                                res.status(400).send(`This field only accept values ${result2[0]['permitted_values']}`)}
                                            break
                                        case 'I':
                                            if (parseInt(req.body.value) === parseFloat(req.body.value)) {
                                                createEntry(req, res, 'test_data', req.body, 'Error. Malformed request.');
                                            } else {res.status(400).send(`This field only accept integer`)}
                                            break
                                        case 'N':
                                            if (parseFloat(req.body.value)) {
                                                createEntry(req, res, 'test_data', req.body, 'Error. Malformed request.');
                                            } else {res.status(400).send(`This field only accept number`)}
                                            break
                                    }
                                } else {
                                    res.status(404).send('cannot seem to find your field or your field does not match your test type!');
                                }
                            })
                    } else {
                        res.status(404).send('seems like the test does not exist!');
                    }
                })
        } else {
            res.status(400).send('please provide test id as key "test"');
        }
    }

    addCeData(req, res){
        if (req.body['clinical_event']){
            knex('clinical_events')
                .select('id', 'type')
                .where({id: req.body['clinical_event'], deleted: 0})
                .then(result1 => {
                    if (result1.length === 1)  {
                        knex('available_fields_ce')
                            .select('type', 'permitted_values', 'event_type')
                            .where('id', req.body.field)
                            .then(result2 => {
                                if (result2.length === 1 && result1[0].type === result2[0]['event_type']){
                                    switch (result2[0].type) {
                                        case 'B':
                                            if (req.body.value === 1 || req.body.value === 0) {
                                                createEntry(req, res, 'clinical_events_data', req.body, 'Error. Malformed request.');
                                            } else {res.status(400).send('This field only accept value 1 and 0.')}
                                            break
                                        case 'C':
                                            if (result2[0]['permitted_values'].split(', ').indexOf(req.body.value) !== -1) {  //see if the value is in the permitted values
                                                createEntry(req, res, 'clinical_events_data', req.body, 'Error. Malformed request.');
                                            } else {
                                                res.status(400).send(`This field only accept values ${result2[0]['permitted_values']}`)}
                                            break
                                        case 'I':
                                            if (parseInt(req.body.value) === parseFloat(req.body.value)) {
                                                createEntry(req, res, 'clinical_events_data', req.body, 'Error. Malformed request.');
                                            } else {res.status(400).send(`This field only accept integer`)}
                                            break
                                        case 'N':
                                            if (parseFloat(req.body.value)) {
                                                createEntry(req, res, 'clinical_events_data', req.body, 'Error. Malformed request.');
                                            } else {res.status(400).send(`This field only accept number`)}
                                            break
                                    }
                                } else {
                                    res.status(404).send('cannot seem to find your field or your field does not match your event type!');
                                }
                            })
                    } else {
                        res.status(404).send('seems like the event does not exist!');
                    }
                })
        } else {
            res.status(400).send('please provide event id as key "clinical_event"');
        }
    }
}

//treatment
//treatment data
//relapse
//relapse data
//test
//test data


module.exports = new DataController();