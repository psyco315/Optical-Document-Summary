import React from 'react';
import { Upload } from 'lucide-react';

const FileUpload = ({ onFileSelect }) => (
  <div
    className="inline-flex items-center px-3 py-2 mr-2 text-sm text-white/80 bg-gray-400/50 hover:bg-[#2a2a2a] cursor-pointer rounded-tr-[.3rem]"
    onClick={onFileSelect}
  >
    <Upload size={14} className="mr-1" />
    <span>Add more files +</span>
  </div>
);

export default FileUpload;