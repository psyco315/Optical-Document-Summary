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
                <div className="backdrop-blur-xl bg-black/20 border border-white/30 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-white/10 to-transparent">
                        <h2 className="text-xl font-bold text-white drop-shadow-lg">Upload Files</h2>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white p-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 transition-all duration-300 hover:scale-110 hover:bg-white/20"
                        >
                            <X size={20} />
                        </button>
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

                    {/* Modal Footer */}
                    <div className="px-6 py-4 border-t border-white/20 flex justify-end bg-gradient-to-t from-white/5 to-transparent">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-white/80 hover:text-white font-semibold rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
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