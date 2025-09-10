import pdf from 'pdf-parse';

const extractPDFText = async (req, res) => {
  try {
    let buffer;
    // console.log(req.file)
    
    // Method 1: Handle file upload (from multer)
    if (req.file && req.file.buffer) {
      buffer = req.file.buffer;
    }
    else {
      return res.status(400).json({
        success: false,
        error: 'No PDF provided',
        message: 'Please provide PDF via file upload'
      });
    }
    
    // Extract text using pdf-parse
    const data = await pdf(buffer);
    
    // Return extracted text
    return res.json({
      success: true,
      text: data.text,
      pages: data.numpages,
      info: data.info || {}
    });
    
  } catch (error) {
    console.error('PDF extraction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to extract text from PDF',
      details: error.message
    });
  }
};

export default extractPDFText;