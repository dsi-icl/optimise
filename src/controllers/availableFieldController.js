const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class AvailableFieldController {
    constructor(){
        this._Router = this._Router.bind(this);
        this.GETclinicalEvents = this.GETfields.bind(this);
        this.GETtestTypes = this.GETfields.bind(this);
     }


    _Router(req, res){
        try {
            this[`${req.method}${req.params.dataType}`](req, res);
        } catch(e) {
            if (e instanceof TypeError){
                res.status(400).send(`Bad request. Cannot ${req.method} this API endpoint!`);
            } else {
                res.status(500).send('Server Error!');
            }
        }
    }


    GETfields(req, res){     //bound to GETclinicalEvents and GETtestTypes too
        let moduleObj = {};
        if (req.params.dataType === 'fields' && req.query.module) {
            moduleObj = {module: req.query.module};
        }
        let table;
        switch (req.params.dataType) {
            case 'fields':
                table = 'available_fields';
                break
            case 'clinicalEvents':
                table = 'available_clinical_event_types';
                break
            case 'testTypes':
                table = 'available_test_types';
                break
        }
        knex(table)
            .select('*')
            .where(moduleObj)
            .then(result => res.status(200).json(result))
            .catch(err => {console.log(err); res.status(500).send('database error')});
    }

}


module.exports = new AvailableFieldController();