import React from 'react';
import { ExternalLink } from 'lucide-react';

const FileInfo = ({ fileName, fileType, onViewFile }) => (
  <div className="text-white pt-2 pl-3 flex items-center gap-4 text-sm">
    <span>File Name: {fileName}</span>
    <span>File Type: {fileType}</span>
    <button 
      onClick={onViewFile}
      className="flex items-center gap-1 hover:text-blue-200 hover:underline cursor-pointer transition-colors"
    >
      <ExternalLink size={14} />
      View File
    </button>
  </div>
);

export default FileInfo;