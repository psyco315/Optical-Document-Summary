import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ onCopy, text = "Copy", isContent }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy?.(); // run external copy handler if provided
    setCopied(true);

    // reset after 2 seconds
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      onClick={isContent && handleCopy}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:cursor-pointer"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied!" : text}
    </button>
  );
};

export default CopyButton;
