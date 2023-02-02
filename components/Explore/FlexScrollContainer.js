import React from 'react';

export default function FlexScrollContainer({ children, className }) {
  return (
    <div className={`grow relative mt-3 ${className}`}>
      <div className='sm:absolute sm:inset-0 sm:overflow-y-auto sm:custom-scrollbar sm:custom-scrollbar-vertical sm:snap-y sm:snap-mandatory sm:border sm:border-dark-1 sm:rounded-sm sm:p-3 sm:bg-dark-3'>
        {children}
      </div>
    </div>
  );
}
