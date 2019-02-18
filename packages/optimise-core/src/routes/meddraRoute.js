import express from 'express';
const meddra = express();
import multer from 'multer';
const upload = multer({ storage: multer.MemoryStorage });

import MeddraController from '../controllers/meddraController';

meddra.route('/')
    .post(upload.fields([{ name: 'lltfile', maxCount: 1 }, { name: 'mdhierfile', maxCount: 1 }]), MeddraController.handleMeddraUploadByAdmin);

export default meddra;