import React from 'react';

export default function CardBody({ children }) {
  return <div className='flex flex-col bg-dark-4 px-4 py-4 md:px-6 md:py-5'>{children}</div>;
}
