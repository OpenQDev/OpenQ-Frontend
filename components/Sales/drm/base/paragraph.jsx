import React from 'react';

const Paragraph = ({ children, className }) => {
  return <div className={`text-gray-800 text-lg lg:text-xl ${className}`}>{children}</div>;
};

export default Paragraph;
