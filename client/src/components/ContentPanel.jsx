import React from 'react';
import CopyButton from './CopyButton';

const ContentPanel = ({ title, children, onCopy, isContent }) => (
  <div className="flex-1 backdrop-blur-xl bg-gray-800/50 border border-white/30 text-white relative m-1 rounded-[3px] ">
    <div className="flex justify-between items-center p-4 border-b border-gray-600">
      <h2 className="text-lg font-medium">{title}</h2>
      <CopyButton onCopy={onCopy} isContent={isContent}/>
    </div>
    <div className="p-4 overflow-y-auto">
      {children}
    </div>
  </div>
);

export default ContentPanel;