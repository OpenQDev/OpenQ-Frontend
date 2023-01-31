import React from 'react';

export default function FlexScrollContainer({ children, className }) {
  return (
    <div className={`grow relative mt-3 ${className}`}>
      <div className='md:absolute md:inset-0 md:overflow-y-auto md:custom-scrollbar md:custom-scrollbar-vertical md:snap-y md:snap-mandatory md:border md:border-dark-1 md:rounded-sm md:p-3 md:bg-dark-3'>
        {children}
      </div>
    </div>
  );
}
