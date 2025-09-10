import React from 'react';
import { Upload } from 'lucide-react';

const FileUpload = ({ onFileSelect }) => (
  <div
    className="inline-flex items-center px-3 py-2 text-sm bg-gray-400 hover:bg-gray-350 cursor-pointer border-r border-gray-400"
    onClick={onFileSelect}
  >
    <Upload size={14} className="mr-1" />
    <span>Add more files +</span>
  </div>
);

export default FileUpload;