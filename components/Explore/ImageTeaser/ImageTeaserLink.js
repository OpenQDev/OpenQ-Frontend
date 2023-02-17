import React from 'react';

export default function ImageTeaserLink({ children, className = '' }) {
  return <div className={`lead flex items-center lg:text-2xl lg:mb-3 ${className}`}>{children}</div>;
}
