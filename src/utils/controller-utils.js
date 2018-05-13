const knex = require('../utils/db-connection');

exports.createEntry = (req, res, tablename, entryObj, databaseErrMsg) => {
    entryObj.deleted = 0;
    knex(tablename)
    .insert(entryObj)
    .then(result => res.status(200).json(result))
    .catch(err => {
        console.log(err);
        res.status(400).send(databaseErrMsg);
    })
};


exports.deleteEntry = (req,res, tablename, whereObj, whatIsDeleted, expectedNumAffected /* LT 0 */) => {
    whereObj.deleted = 0;
    knex(tablename)
    .where(whereObj)
    .update({deleted: req.requester.userid + '@' + JSON.stringify(new Date())})
    .then(result => {
        switch (result){
            case 0:
                res.status(401).json('ID does not exist');
                break
            case expectedNumAffected:
                res.status(200).send(whatIsDeleted + ' has been deleted successfully.');
                break
            default:
                res.status(500).send('something weird happened');
                break
        }})
    .catch(err => {
        console.log(err);
        res.status(400).send('Database error');
    })
}