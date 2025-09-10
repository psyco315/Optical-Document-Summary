import express from 'express';
import { extractTextOCR } from '../controllers/ocrController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Routes

router.post('/extract',
    upload.single('pdf'),
    (req, res) => { extractTextOCR(req, res) }
);

export default router