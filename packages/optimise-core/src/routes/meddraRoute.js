const express = require('express');
const meddra = express();
const multer = require('multer');
const upload = multer({ storage: multer.MemoryStorage });

const MeddraController = require('../controllers/meddraController');

const medCtrl = new MeddraController();

meddra.route('/')
    .post(upload.fields([{ name: 'lltfile', maxCount: 1 }, { name: 'mdhierfile', maxCount: 1 }]), medCtrl.handleMeddraUploadByAdmin);

module.exports = meddra;