import React, { useState, useRef } from 'react';
import { WarpBackground } from "@/components/magicui/warp-background";
import { motion } from "motion/react"


// Import all components
import Header from './Header';
import FileTab from './FileTab';
import FileUpload from './FileUpload';
import FileUploadModal from './FileUploadModal';
import FileInfo from './FileInfo';
import SummaryToggle from './SummaryToggle';
import SummarizeButton from './SummarizeButton';
import ContentPanel from './ContentPanel';

import { Upload, X, FolderOpen } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('img1');
  const [summaryLength, setSummaryLength] = useState('Medium');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState('');
  // Add missing state variables
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Filter for supported file types (images and PDFs)
    const supportedFiles = files.filter(file =>
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    if (supportedFiles.length > 0) {
      handleFilesSelected(supportedFiles);
      handleCloseUploadModal();
    } else {
      alert('Please select image files (PNG, JPG, GIF) or PDF documents.');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileClose = (fileId) => {
    setFiles(files.filter(file => file.id !== fileId));
    if (activeTab === fileId && files.length > 1) {
      const remainingFiles = files.filter(file => file.id !== fileId);
      setActiveTab(remainingFiles[0]?.id || '');
    }
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleFilesSelected = (selectedFiles) => {
    // Convert File objects to our file format
    const newFiles = selectedFiles.map((file, index) => {
      const fileType = file.type.startsWith('image/') ? 'Image' : 'PDF';
      return {
        id: `file_${Date.now()}_${index}`,
        name: file.name.split('.')[0], // Remove extension for display
        type: fileType,
        originalFile: file // Store the original file for future processing
      };
    });

    setFiles(prevFiles => [...prevFiles, ...newFiles]);

    // Set the first new file as active if no files were previously active
    if (newFiles.length > 0) {
      setActiveTab(newFiles[0].id);
    }
  };

  const handleExtractText = async () => {
    const currentFile = files.find(file => file.id === activeTab);

    if (!currentFile?.originalFile) {
      setExtractionError('This is a sample file. Please upload a real file to extract text.');
      setExtractedText('');
      return;
    }

    setIsExtracting(true);
    setExtractionError('');
    setExtractedText('');

    try {
      if (currentFile.type === 'Image') {
        // For images, send directly to OCR endpoint with 'pdf' key
        await extractWithOCR(currentFile.originalFile);
      } else if (currentFile.type === 'PDF') {
        // For PDFs, try PDF extraction first
        const pdfSuccess = await extractWithPDF(currentFile.originalFile);

        // If PDF extraction fails or returns no text, fall back to OCR
        if (!pdfSuccess) {
          await extractWithOCR(currentFile.originalFile);
        }
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      setExtractionError('Failed to extract text from file');
    } finally {
      setIsExtracting(false);
    }
  };

  // Get backend URL - use environment variable if available, otherwise default to localhost:3000
  const getBackendUrl = () => {
    // Check if we're in development (localhost) or production
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Try to get environment variable first
    const envBackendUrl = process.env.REACT_APP_BACKEND_URL;

    if (envBackendUrl) {
      return envBackendUrl;
    }

    // Fallback logic
    if (isDevelopment) {
      return 'http://localhost:3000'; // Your local backend
    } else {
      // Replace with your actual production backend URL
      return 'https://optical-document-summary-server.vercel.app'; // Your production backend
    }
  };
  const extractWithPDF = async (file) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file); // Change to 'pdf' to match your multer config

      const response = await fetch(`${getBackendUrl()}/api/pdf/extract`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.text && data.text.trim()) {
        setExtractedText(data.text);
        console.log("Used pdf")
        return true; // Success
      } else {
        console.log('PDF extraction returned no text or failed');
        return false; // No text or failed
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      return false; // Failed
    }
  };

  const extractWithOCR = async (file) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file); // Using 'pdf' key as specified

      const response = await fetch(`${getBackendUrl()}/api/ocr/extract`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setExtractedText(data.text);
        console.log("Used ocr")
      } else {
        setExtractionError(data.error || 'Failed to fetch data for this file');
      }
    } catch (error) {
      console.error('OCR extraction error:', error);
      setExtractionError('Failed to fetch data for this file');
    }
  };

  const handleSummarize = async () => {
    if (!extractedText.trim()) {
      setSummaryError('Please extract text first before summarizing.');
      return;
    }

    setIsSummarizing(true);
    setSummaryError('');
    setSummary('');

    try {
      const response = await fetch(`${getBackendUrl()}/api/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extractedText,
          summaryType: summaryLength.toLowerCase()
        }),
      });

      const data = await response.json();
      // console.log(data)

      if (response.ok && data.data) {
        setSummary(data.data.summary);
      } else {
        setSummaryError(data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Summarization error:', error);
      setSummaryError('Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleViewFile = () => {
    const currentFile = files.find(file => file.id === activeTab);
    if (!currentFile?.originalFile) {
      // Handle case where it's a default file (no originalFile)
      alert('This is a sample file. Please upload a real file to view it.');
      return;
    }

    // Create object URL for the file
    const fileURL = URL.createObjectURL(currentFile.originalFile);

    // Open in new tab
    const newTab = window.open(fileURL, '_blank');

    // Clean up the object URL after a delay to free memory
    setTimeout(() => {
      URL.revokeObjectURL(fileURL);
    }, 1000);

    // Handle case where popup was blocked
    if (!newTab) {
      alert('Popup blocked! Please allow popups for this site to view files.');
    }
  };

  const currentFile = files.find(file => file.id === activeTab);

  return (
    <motion.div className="min-h-screen flex flex-col bg-[#2a2a2a] hover:cursor-default"
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      transition={{
        duration: .5
      }}
    >
      <Header author="Parth Sarathi Yadav" />

      {/* File Tabs */}
      {
        files.length !== 0 && (<div className="bg-[#0A0A0A] flex items-center">
          {files.map((file) => (
            <FileTab
              key={file.id}
              fileName={file.name}
              isActive={activeTab === file.id}
              onClick={() => setActiveTab(file.id)}
              onClose={() => handleFileClose(file.id)}
              showClose={files.length > 1}
            />
          ))}
          <FileUpload onFileSelect={handleOpenUploadModal} />
        </div>)
      }

      {/* File Info Bar */}
      {currentFile && (
        <FileInfo
          fileName={currentFile.name}
          fileType={currentFile.type}
          onViewFile={handleViewFile}
        />
      )}


      {/* Content Panels */}
      {files.length === 0 ?
        <WarpBackground gridColor='rgba(255, 255, 255, 0.20)'>
          <motion.div className="backdrop-blur-xl bg-black/20 border border-white/30 rounded-2xl shadow-2xl max-w-md w-full mx-auto my-16 overflow-hidden"
            initial={{
              scale: 0
            }}
            animate={{
              scale: 1
            }}
            transition={{
              duration: .5
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-white/10 to-transparent">
              <h2 className="text-xl font-bold text-white drop-shadow-lg">Upload Files</h2>
            </div>

            {/* Modal Content */}
            <div className="p-6 backdrop-blur-sm bg-white/5">
              {/* Drag and Drop Area */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 backdrop-blur-md ${isDragOver
                  ? 'border-green-400/60 bg-green-500/20 shadow-lg shadow-green-500/20'
                  : 'border-white/40 bg-white/10 hover:bg-white/15'
                  }`}
              >
                <div className="flex flex-col items-center">
                  <Upload size={56} className={`mb-4 transition-all duration-300 ${isDragOver ? 'text-green-400 scale-110' : 'text-white/80'
                    }`} />

                  <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md">
                    {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
                  </h3>

                  <p className="text-sm text-white/70 mb-4 drop-shadow-sm">
                    Supported formats: PDF, PNG, JPG, JPEG, WEBP
                  </p>

                  <div className="flex items-center gap-4 w-full">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <span className="text-sm text-white/60 px-2 bg-white/10 rounded-full backdrop-blur-sm">OR</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Browse Button */}
              <div className="mt-6">
                <button
                  onClick={handleBrowseClick}
                  className="w-full bg-gradient-to-r from-green-500/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] hover:cursor-pointer"
                >
                  <FolderOpen size={20} />
                  Browse Files
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileInput}
                className="hidden"
              />

              {/* Help Text */}
              <div className="mt-6 text-xs text-white/60 space-y-1 bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                <p className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  You can select multiple files at once
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  Maximum file size: 10MB per file
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  Supported formats: PDF, PNG, JPG, JPEG, WEBP
                </p>
              </div>
            </div>
          </motion.div>
        </WarpBackground>

        : //-------------------------------------------------------------------------------------------------------------------------------------

        <div className="bg-[#2a2a2a] flex flex-1 pt-2 justify-center w-full">
          <div className='flex flex-col w-1/2 gap-1'>
            <div className='flex justify-end'>
              <button
                onClick={handleExtractText}
                disabled={isExtracting || !currentFile}
                className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-medium transition-colors hover:cursor-pointer'
              >
                {isExtracting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Extracting...
                  </div>
                ) : (
                  'Extract Text'
                )}
              </button>
            </div>
            <ContentPanel
              title="Extracted Text"
              onCopy={extractedText ? () => handleCopyText(extractedText, 'Extracted Text') : undefined}
            >
              <div className="text-gray-300">
                {isExtracting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Extracting text...</span>
                  </div>
                ) : extractionError ? (
                  <div className="text-red-400">
                    Error: {extractionError}
                  </div>
                ) : extractedText ? (
                  extractedText
                ) : (
                  'Upload and select a document, then click "Extract Text" to extract text...'
                )}
              </div>
            </ContentPanel>
          </div>

          <div className='flex flex-col w-1/2 gap-1'>
            <div className='flex justify-end gap-4'>
              <SummaryToggle
                length={summaryLength}
                onChange={setSummaryLength}
              />
              <SummarizeButton
                onClick={handleSummarize}
                disabled={!extractedText.trim() || isSummarizing || !currentFile}
              />
            </div>
            <ContentPanel
              title="Summary"
              onCopy={summary ? () => handleCopyText(summary, 'Summary') : undefined}
            >
              <div className="text-gray-300">
                {isSummarizing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating summary...</span>
                  </div>
                ) : summaryError ? (
                  <div className="text-red-400">
                    Error: {summaryError}
                  </div>
                ) : summary ? (
                  summary
                ) : (
                  'Extract text first, then click "Summarize!" to generate a summary...'
                )}
              </div>
            </ContentPanel>
          </div>
        </div>
      }

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onFileSelect={handleFilesSelected}
      />
    </motion.div>
  );
};

export default Home;