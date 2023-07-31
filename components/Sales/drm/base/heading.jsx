import React from 'react';

const Heading = ({ children, className }) => {
  return (
    <div className={`leading-tight text-black font-extrabold lg:text-[42px] text-[30px] ${className}`}>{children}</div>
  );
};
export default Heading;
