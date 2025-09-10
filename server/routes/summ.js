import express from 'express';
import { summarizeText } from '../controllers/summ.js';

const router = express.Router();

// Routes

router.post('',
    (req, res) => { summarizeText(req, res) }
);

export default router