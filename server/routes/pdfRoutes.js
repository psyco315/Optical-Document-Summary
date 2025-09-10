import express from 'express';
import multer from 'multer';
import extractPDFText from '../controllers/pdfController.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    file.mimetype === 'application/pdf' 
      ? cb(null, true) 
      : cb(new Error('Only PDF files allowed'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/extract', upload.single('pdf'), extractPDFText);

export default router