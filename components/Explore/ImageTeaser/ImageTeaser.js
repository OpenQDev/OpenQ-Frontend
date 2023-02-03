import React from 'react';

export default function ImageTeaser({ children, imageSrc, textPosition = 'bottom' }) {
  return (
    <div
      className='@container flex bg-no-repeat bg-contain border border-dark-1 rounded-3xl aspect-square overflow-hidden'
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      <div
        style={{ padding: 'clamp(1.25rem, 5cqw, 2.5rem)' }}
        className={`flex flex-col bg-gradient-to-t from-black grow ${textPosition === 'bottom' ? 'justify-end' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}
