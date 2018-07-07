const { getEntry, createEntry, deleteEntry, updateEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const knex = require('../utils/db-connection');

function Treatment(){
    this.getTreatment = Treatment.prototype.getTreatment.bind(this);
    this.createTreatment = Treatment.prototype.createTreatment.bind(this);
    this.updateTreatment = Treatment.prototype.updateTreatment.bind(this);
    this.addTerminationDateTreatment = Treatment.prototype.addTerminationDateTreatment.bind(this);
    this.deleteTreatment = Treatment.prototype.deleteTreatment.bind(this);
    this.addInterruption = Treatment.prototype.addInterruption.bind(this);
    this.deleteInterruption = Treatment.prototype.deleteInterruption.bind(this);
}

Treatment.prototype.getTreatment = function(treatment){
    return new Promise(function(resolve, reject){
        getEntry('TREATMENTS', treatment, '*').then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.NOTFOUND, error));
        });
    });
};

Treatment.prototype.createTreatment = function(treatment){
    return new Promise(function(resolve, reject){
        createEntry('TREATMENTS', treatment).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Treatment.prototype.updateTreatment = function(requester, idTreatment, updatedEntry){
    return new Promise(function(resolve, reject){
        updateEntry('TREATMENTS', requester, '*', { id: idTreatment }, updatedEntry).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

Treatment.prototype.addTerminationDateTreatment = function(idTreatment, updateEntry){
    return new Promise(function(resolve, reject){
        knex('TREATMENTS').where({ id: idTreatment }).update(updateEntry).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

Treatment.prototype.deleteTreatment = function(requester, idTreatment){
    return new Promise(function(resolve, reject){
        deleteEntry('TREATMENTS', requester, { id: idTreatment }).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

Treatment.prototype.addInterruption = function(__unused__requester, interruption){
    return new Promise(function(resolve, reject){
        createEntry('TREATMENTS_INTERRUPTIONS', interruption).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Treatment.prototype.deleteInterruption = function(requester, idInterruption){
    return new Promise(function(resolve, reject){
        deleteEntry('TREATMENTS_INTERRUPTIONS', requester, { id: idInterruption }).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

module.exports = Treatment;