import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureTesseractTestFile() {
  // Try multiple possible root directories
  const possibleRoots = [
    process.cwd(),
    __dirname,
    path.join(__dirname, '..'),
    path.join(__dirname, '../..'),
    '/var/task' // Vercel's working directory
  ];

  for (const root of possibleRoots) {
    try {
      const testDir = path.join(root, 'test', 'data');
      const pdfPath = path.join(testDir, '05-versions-space.pdf');
      
      console.log(`Trying to create test file at: ${pdfPath}`);
      
      // Create directory if it doesn't exist
      fs.mkdirSync(testDir, { recursive: true });
      
      // Create the PDF file if it doesn't exist
      if (!fs.existsSync(pdfPath)) {
        const minimalPdf = Buffer.from(
          '%PDF-1.4\n' +
          '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
          '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
          '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\n' +
          'xref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n' +
          'trailer<</Size 4/Root 1 0 R>>\nstartxref\n189\n%%EOF'
        );
        
        fs.writeFileSync(pdfPath, minimalPdf);
        console.log(`✅ Created Tesseract test file at: ${pdfPath}`);
      } else {
        console.log(`✅ Test file already exists at: ${pdfPath}`);
      }
      
      // If we get here, it worked
      return pdfPath;
      
    } catch (error) {
      console.log(`❌ Failed to create test file at root ${root}:`, error.message);
      continue;
    }
  }
  
  console.warn('⚠️ Could not create test file in any location');
}

// Alternative: Create it in /tmp (Vercel's writable directory)
function ensureTesseractTestFileInTmp() {
  try {
    const testDir = '/tmp/test/data';
    const pdfPath = '/tmp/test/data/05-versions-space.pdf';
    
    console.log(`Creating test file in tmp: ${pdfPath}`);
    
    fs.mkdirSync(testDir, { recursive: true });
    
    if (!fs.existsSync(pdfPath)) {
      const minimalPdf = Buffer.from(
        '%PDF-1.4\n' +
        '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
        '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
        '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\n' +
        'xref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n' +
        'trailer<</Size 4/Root 1 0 R>>\nstartxref\n189\n%%EOF'
      );
      
      fs.writeFileSync(pdfPath, minimalPdf);
      console.log(`✅ Created Tesseract test file in /tmp: ${pdfPath}`);
      
      // Also try to create a symlink to the expected location
      try {
        const expectedDir = './test/data';
        fs.mkdirSync(expectedDir, { recursive: true });
        fs.symlinkSync(pdfPath, './test/data/05-versions-space.pdf');
        console.log('✅ Created symlink to expected location');
      } catch (linkError) {
        console.log('Could not create symlink:', linkError.message);
      }
    }
    
    return pdfPath;
  } catch (error) {
    console.error('❌ Failed to create test file in /tmp:', error);
  }
}

// Run both strategies
console.log('🔧 Setting up Tesseract test file...');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

ensureTesseractTestFile();
ensureTesseractTestFileInTmp();

export { ensureTesseractTestFile, ensureTesseractTestFileInTmp };