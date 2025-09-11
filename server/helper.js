import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureTesseractTestFile() {
  // Use __dirname instead of process.cwd() for more reliable path resolution
  const testDir = path.join(__dirname, 'test', 'data');
  const pdfPath = path.join(testDir, '05-versions-space.pdf');
  
  if (!fs.existsSync(pdfPath)) {
    fs.mkdirSync(testDir, { recursive: true });
    
    // Create a minimal valid PDF file
    const minimalPdf = Buffer.from(
      '%PDF-1.4\n' +
      '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
      '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
      '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\n' +
      'xref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n' +
      'trailer<</Size 4/Root 1 0 R>>\nstartxref\n189\n%%EOF'
    );
    
    fs.writeFileSync(pdfPath, minimalPdf);
    console.log('Created required Tesseract test file:', pdfPath);
  }
}

// Call this before initializing Tesseract
ensureTesseractTestFile();

export { ensureTesseractTestFile };