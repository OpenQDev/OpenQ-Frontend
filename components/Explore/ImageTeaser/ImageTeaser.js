import React from 'react';

export default function ImageTeaser({ children, imageSrc, textPosition = 'bottom', className = '' }) {
  return (
    <div
      className='flex bg-no-repeat bg-contain border border-dark-1 rounded-3xl aspect-square overflow-hidden'
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      <div
        className={`p-4 md:p-6 xl:p-10 flex flex-col bg-gradient-to-t from-black grow ${textPosition === 'bottom' ? 'justify-end' : ''} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
