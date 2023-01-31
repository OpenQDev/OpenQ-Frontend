import React from 'react';

export default function CardFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between border-t border-dark-1 px-6 py-3 bg-dark-4 text-xs ${className}`}>
      {children}
    </div>
  );
}
