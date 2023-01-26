import React from 'react';

export default function FlexScrollContainer({ children, className }) {
  return (
    <div className={`grow relative mt-3 ${className}`}>
      <div className='absolute inset-0 overflow-y-auto border border-dark-1 rounded-lg p-5 bg-dark-3 custom-scrollbar custom-scrollbar-vertical snap-y snap-mandatory'>
        {children}
      </div>
    </div>
  );
}
