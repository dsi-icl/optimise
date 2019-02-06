const express = require('express');
const meddra = express();
const multer = require('multer');
const upload = multer({ storage: multer.MemoryStorage });

const MeddraController = require('../controllers/meddraController');

const medCtrl = new MeddraController();

meddra.route('/')
    .post(upload.single('file'), medCtrl.handleMeddraUploadByAdmin);

module.exports = meddra;