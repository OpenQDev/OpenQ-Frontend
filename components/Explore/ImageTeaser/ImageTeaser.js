import React from 'react';

export default function ImageTeaser({ children, imageSrc, textPosition = 'bottom' }) {
  return (
    <div
      className={`@container flex flex-col bg-no-repeat bg-contain border border-dark-1 rounded-3xl aspect-square ${
        textPosition === 'bottom' ? 'justify-end' : ''
      }`}
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      <div style={{padding: 'clamp(1.25rem, 5cqw, 2.5rem)'}}>
        {children}
      </div>
    </div>
  );
}
