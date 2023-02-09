import React from 'react';

export default function CardHeader({ children }) {
  return (
    <div className='flex items-center justify-center border-b border-dark-1 px-4 py-2 md:px-6 md:py-3 bg-dark-2 text-sm'>
      {children}
    </div>
  );
}
