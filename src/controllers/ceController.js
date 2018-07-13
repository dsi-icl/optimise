const ErrorHelper = require('../utils/error_helper');
const clinicalEventCore = require('../core/clinicalEvent');
const message = require('../utils/message-utils');

function CeController() {
    this.clinicalEvent = new clinicalEventCore();

    this.createCe = CeController.prototype.createCe.bind(this);
    this.deleteCe = CeController.prototype.deleteCe.bind(this);
}

CeController.prototype.createCe = function (req, res) {
    if ((req.body.hasOwnProperty('visitId') || req.body.hasOwnProperty('patient')) && req.body.hasOwnProperty('startDate') && req.body.hasOwnProperty('type') && req.body.hasOwnProperty('meddra')) {
        let ce = {};
        if (req.body.hasOwnProperty('visitId'))
            ce.recordedDuringVisit = req.body.visitId;
        if (req.body.hasOwnProperty('patient'))
            ce.patient = req.body.patient;
        ce.type = req.body.type;
        ce.meddra = req.body.meddra;
        ce.dateStartDate = Date.parse(req.body.startDate);
        ce.createdByUser = req.user.id;
        this.clinicalEvent.createClinicalEvent(ce).then(function (result) {
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

CeController.prototype.deleteCe = function (req, res) {
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (req.body.hasOwnProperty('ceId')) {
        this.clinicalEvent.deleteClinicalEvent(userId, { 'id': req.body.ceId }).then(function(result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

module.exports = CeController;