import React from 'react';

const Paragraph = ({ children, className }) => {
  return <p className={`text-gray-800 text-lg lg:text-xl ${className}`}>{children}</p>;
};

export default Paragraph;
