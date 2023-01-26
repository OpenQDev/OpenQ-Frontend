import React from 'react';

export default function ImageTeaser({ children, imageSrc, textPosition = 'bottom' }) {
  return (
    <div
      className={`flex flex-col bg-no-repeat bg-contain border border-dark-1 rounded-3xl aspect-square p-5 lg:p-10 ${
        textPosition === 'bottom' ? 'justify-end' : ''
      }`}
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      {children}
    </div>
  );
}
