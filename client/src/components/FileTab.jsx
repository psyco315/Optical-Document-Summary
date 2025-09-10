import React from 'react';
import { X } from 'lucide-react';

const FileTab = ({ fileName, isActive, onClick, onClose, showClose = true }) => (
  <div className={`inline-flex items-center px-3 py-2 text-sm cursor-pointer border-r border-gray-400 ${
    isActive ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-350'
  }`}>
    <span onClick={onClick} className="mr-2">{fileName}</span>
    {showClose && (
      <X 
        size={14} 
        onClick={onClose}
        className="hover:bg-gray-500 hover:text-white rounded"
      />
    )}
  </div>
);

export default FileTab;