const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry, addFieldData} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class DataController {
    constructor(){
        this._Router = this._Router.bind(this);
    }

    _Router(req, res){
        try {
            this[`${req.method}`](req, res);
        } catch(e) {
            if (e instanceof TypeError){
                res.status(400).send(`Bad request. Cannot ${req.method} this API endpoint!`);
            } else {
                res.status(500).send('Server Error!');
            }
        }
    }

    createData(req, res){
        let dataTable;
        let fieldTable;
        let foreignTable;
        let idField;
        switch (req.params.dataType) {
            case 'clinicalEvent':
                dataTable = 'clinical_events_data';
                fieldTable = 'available_fields_tests';   //not sure about this
                foreignTable = 'clinical_events';
                idField = req.body.CeId;
            case 'visit':
                dataTable = 'visit_collected_data';
                fieldTable = 'available_fields_visits';
                foreignTable = 'visits';
                idField = req.body.visitId;
            case 'test':
                dataTable = 'test_data';
                fieldTable = 'available_fields_tests';
                foreignTable = 'ordered_tests';
                idField = req.body.testId;
        }
        addFieldData(req, res, fieldTable, dataTable, foreignTable, idField);
    }

    PUT(req, res){
    }

    DELETE(req, res){
        if (req.requester.priv === 1){
            deleteEntry(req, res, 'visit_collected_data', {visit: req.body.visit, field: req.body.field}, req.body.field, 1);
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