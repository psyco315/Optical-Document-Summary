import React, { useState, useRef } from 'react';
import { Upload, X, FolderOpen } from 'lucide-react';
import { WarpBackground } from "@/components/magicui/warp-background";

const FileUploadModal = ({ isOpen, onClose, onFileSelect }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

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
            onFileSelect(supportedFiles);
            onClose();
        } else {
            alert('Please select image files (PNG, JPG, GIF) or PDF documents.');
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
            <WarpBackground gridColor='rgba(255, 255, 255, 0.20)' height={100}>
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Upload Files</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6">
                        {/* Drag and Drop Area */}
                        <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300 bg-gray-50'
                                }`}
                        >
                            <div className="flex flex-col items-center">
                                <Upload size={48} className={`mb-4 ${isDragOver ? 'text-green-500' : 'text-gray-400'
                                    }`} />

                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
                                </h3>

                                <p className="text-sm text-gray-500 mb-4">
                                    Supported formats: PDF, PNG, JPG, JPEG, WEBP
                                </p>

                                <div className="flex items-center gap-4 w-full">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-sm text-gray-500">OR</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>
                            </div>
                        </div>

                        {/* Browse Button */}
                        <div className="mt-4">
                            <button
                                onClick={handleBrowseClick}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors hover:cursor-pointer"
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
                        <div className="mt-4 text-xs text-gray-500">
                            <p>• You can select multiple files at once</p>
                            <p>• Maximum file size: 10MB per file</p>
                            <p>• Supported formats: PDF, PNG, JPG, JPEG, WEBP</p>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </WarpBackground>
        </div>
    );
};

export default FileUploadModal;