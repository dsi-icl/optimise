const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class VisitDataController {
    getFields(req, res){
        knex('available_fields')
            .select('*')
            .then(result => res.status(200).json(result))
            .catch(err => {console.log(err); res.status(500).send('database error')});
    }

    addVisitData(req, res){             //see if I should make an api that accepts updating multiple fields instead
        knex('visits')
            .select('id')
            .where({id: req.body.visit, deleted: 0})
            .then(result => {
                if (result.length === 1)  {
                    knex('available_fields')
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
    }
}

module.exports = new VisitDataController();