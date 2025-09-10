import React from 'react';
import { X } from 'lucide-react';
import { BorderBeam } from "@/components/magicui/border-beam";

const FileTab = ({ fileName, isActive, onClick, onClose, showClose = true }) => (
  <div className={`relative inline-flex text-white items-center px-3 py-2 text-sm cursor-pointer border-r border-gray-400 ${
    isActive ? 'bg-[#2a2a2a]' : 'bg-[#0A0A0A] hover:bg-[#2a2a2a]'
  }`}>
    { isActive && (<BorderBeam/>)}
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