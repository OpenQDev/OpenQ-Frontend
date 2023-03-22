// pages/index.js
import dynamic from 'next/dynamic';
import React from 'react';

const DynamicComponent = dynamic(() => import('./NoSSR').then((mod) => mod.NoSSR));
export function NoSSR({ children }) {
  return <>{children}</>;
}
export default DynamicComponent;
