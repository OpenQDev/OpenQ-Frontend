import React from 'react';

export default function CardHeader({ children }) {
  return (
    <div className='flex items-center justify-center border-b border-dark-1 px-6 py-3 bg-dark-2 text-sm'>
      {children}
    </div>
  );
}
