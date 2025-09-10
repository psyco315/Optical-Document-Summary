import React from 'react';
import { ExternalLink } from 'lucide-react';

const FileInfo = ({ fileName, fileType, onViewFile }) => (
  <div className="text-white/60 pt-2 pl-3 flex items-center gap-8 text-[1.3rem]">
    <span>File Name: <span className='text-white'>{fileName}</span> </span>
    <span>File Type: <span className='text-white'>{fileType}</span> </span>
    <button
      onClick={onViewFile}
      className="flex items-center gap-1 text-white hover:text-blue-200 hover:underline cursor-pointer transition-colors"
    >
      <ExternalLink size={14} />
      View File
    </button>
  </div>
);

export default FileInfo;