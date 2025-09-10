import React from 'react';

const SummaryToggle = ({ length, onChange }) => (
  <div className="flex bg-gray-400 rounded overflow-hidden">
    {['Short', 'Medium', 'Long'].map((option) => (
      <button
        key={option}
        onClick={() => onChange(option)}
        className={`px-4 py-1 text-sm ${
          length === option 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-400 hover:bg-gray-350'
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

export default SummaryToggle;