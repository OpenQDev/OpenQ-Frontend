import React from 'react';

export default function ImageTeaserHeadline({ children, className = '' }) {
  className = className || 'text-2xl lg:text-4xl xl:text-6xl';

  return <h1 className={className}>{children}</h1>;
}
