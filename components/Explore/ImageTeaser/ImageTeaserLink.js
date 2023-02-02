import React from 'react';

export default function ImageTeaserLink({ children, className = '' }) {
  return <div className={`lead flex items-center ${className}`}>{children}</div>;
}
