import React from 'react';

const Header = ({ author }) => (
  <div className="bg-gray-600 text-white p-4">
    <h1 className="text-3xl font-medium">
      Optical Document Summarizer
      <span className="text-[1rem] text-white/70 font-normal ml-2">by {author}</span>
    </h1>
  </div>
);

export default Header;