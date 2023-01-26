import React from 'react';

export default function Card({ children }) {
  return (
    <div className='border-dark-1 rounded-md border overflow-hidden min-w-max w-full snap-start scroll-mx-5 scroll-my-5'>
      {children}
    </div>
  );
}
