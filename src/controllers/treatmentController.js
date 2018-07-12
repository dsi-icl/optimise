const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const TreatmentCore = require('../core/treatment');

function TreatmentController() {
    this.treatment = new TreatmentCore();

    this.createTreatment = TreatmentController.prototype.createTreatment.bind(this);
    this.addTerminationDate = TreatmentController.prototype.addTerminationDate.bind(this);
    this.editTreatment = TreatmentController.prototype.editTreatment.bind(this);
    this.deleteTreatment = TreatmentController.prototype.deleteTreatment.bind(this);
    this.addInterruption = TreatmentController.prototype.addInterruption.bind(this);
    this.deleteInterruption = TreatmentController.prototype.deleteInterruption.bind(this);
    this.getDrugs = TreatmentController.prototype.getDrugs.bind(this);
}

TreatmentController.prototype.createTreatment = function (req, res) {
    if (!(req.body.hasOwnProperty('visitId') && req.body.hasOwnProperty('drugId') && req.body.hasOwnProperty('dose') &&
        req.body.hasOwnProperty('unit') && req.body.hasOwnProperty('form') && req.body.hasOwnProperty('timesPerDay') && req.body.hasOwnProperty('durationInWeeks'))) {
        res.status(400).json(message.userError.MISSINGARGUMENT);
        return;
    }
    if ((req.body.unit !== 'mg' && req.body.unit !== 'cc') ||
        (req.body.form !== 'oral' && req.body.form !== 'IV')) {
        res.status(400).json(message.userError.WRONGARGUMENTS);
        return;
    }
    if (req.body.timesPerDay <= 0 || req.body.durationInWeeks <= 0) {
        res.status(400).json('Wrong value in Times per day or duration in week');
        return;
    }
    let entryObj = {
        'orderedDuringVisit': req.body.visitId,
        'drug': req.body.drugId,
        'dose': req.body.dose,
        'unit': req.body.unit,   //hardcoded SQL: only mg or cc
        'form': req.body.form,   //hardcoded SQL: only oral or IV
        'timesPerDay': req.body.timesPerDay,
        'durationWeeks': req.body.durationInWeeks,
        'terminatedDate': (req.body.hasOwnProperty('terminatedDate') ? Date.parse(req.body.terminatedDate) : null),
        'terminatedReason': (req.body.hasOwnProperty('terminatedReason') ? req.body.terminatedReason : null),
        // field adverseEvent coming up soon.
//        'adverseEvent': (req.body.hasOwnProperty('adverseEvent') ? req.body.adverseEvent : null),
        'createdByUser': req.requester.userid
    };
    this.treatment.createTreatment(entryObj).then(function (result) {
        res.status(200).json(result);
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return;
    });
};

TreatmentController.prototype.addTerminationDate = function (req, res) {    //for adding termination date
    if ((req.body.hasOwnProperty('treatmentId') && req.body.hasOwnProperty('terminationDate')) && req.body.hasOwnProperty('terminatedReason')) {
        this.treatment.addTerminationDateTreatment(req.body.treatmentId, { 'terminatedDate': Date.parse(req.body.terminationDate), 'terminatedReason': req.body.terminatedReason })
            .then(function (result) {
                res.status(200).json(result);
                return;
            }, function (error) {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return;
            });
    } else {
        res.status(400).json(message.userError.MISSINGARGUMENT);
        return;
    }
};

TreatmentController.prototype.editTreatment = function (req, res) {
    if (req.requester.priv === 1) { // Is it really needed that the user must be admin to edit a treatment ?
        let newObj = Object.assign({}, req.body);   //need to change naming
        this.treatment.updateTreatment(req.requester, req.body.id, newObj).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.userError.UPDATEFAIL, error));
            return;
        });
        return;
    }
    else {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
};

TreatmentController.prototype.deleteTreatment = function (req, res) {
    if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (!req.body.treatmentId) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.treatment.deleteTreatment(req.requester, req.body.treatmentId).then(function (result) {
        if (result.body === 0) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL));
        } else {
            res.status(200).json(result);
            return;
        }
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        return;
    });
};

TreatmentController.prototype.addInterruption = function (req, res) {    //need to search if treatment exists
    if (req.body.hasOwnProperty('treatmentId') && req.body.hasOwnProperty('start_date')) {
        let entryObj = {
            'treatment': req.body.treatmentId,
            'startDate': Date.parse(req.body.start_date),
            'meddra': req.body.hasOwnProperty('meddra') ? req.body.meddra : null,
            'endDate': (req.body.hasOwnProperty('end_date') ? Date.parse(req.body.end_date) : null),
            'reason': req.body.hasOwnProperty('reason') ? req.body.reason : null,
            'createdByUser': req.requester.userid
        };
        this.treatment.addInterruption(req.requester, entryObj).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
};

TreatmentController.prototype.deleteInterruption = function (req, res) {
    if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (req.body.hasOwnProperty('treatmentInterId')) {
        this.treatment.deleteInterruption(req.requester, req.body.treatmentInterId).then(function (result) {
            if (result.body === 0) {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL));
            } else {
                res.status(200).json(result);
                return;
            }
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
};

TreatmentController.prototype.getDrugs = function (req, res) {
    if (Object.keys(req.query).length !== 0 && req.query.hasOwnProperty('name')) {
        this.treatment.searchDrugs(`%${req.query.name}%`).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return;
        });
        return;
    } else {
        this.treatment.getDrugs().then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return;
        });
        return;
    }
};

module.exports = TreatmentController;