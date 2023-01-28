import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div
      className={`border-dark-1 rounded-sm border overflow-hidden min-w-max w-full snap-start scroll-mx-5 scroll-my-5 ${className}`}
    >
      {children}
    </div>
  );
}
