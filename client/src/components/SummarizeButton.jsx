import React from 'react';

const SummarizeButton = ({ onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2 rounded text-white font-medium mr-2 ${
      disabled 
        ? 'bg-gray-400 cursor-not-allowed' 
        : 'bg-green-600 hover:bg-green-700 hover:cursor-pointer'
    }`}
  >
    Summarize!
  </button>
);

export default SummarizeButton;