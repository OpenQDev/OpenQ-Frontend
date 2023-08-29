import React from 'react';
const PanelWithMetadata = ({ children }) => {
  return (
    <div className='flex flex-wrap justify-between  w-full px-2 sm:px-8  max-w-[1200px] pb-8 mx-auto'>{children}</div>
  );
};
export default PanelWithMetadata;
