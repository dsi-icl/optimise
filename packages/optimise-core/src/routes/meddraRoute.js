import express from 'express';
import multer from 'multer';

import MeddraController from '../controllers/meddraController';
const meddra = express();
const upload = multer({ storage: multer.MemoryStorage });

meddra.route('/')
    .post(upload.fields([{ name: 'lltfile', maxCount: 1 }, { name: 'mdhierfile', maxCount: 1 }]), MeddraController.handleMeddraUploadByAdmin);

export default meddra;