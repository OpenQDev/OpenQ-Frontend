import React from 'react';

export default function FancyButton({ children, className }) {
  return (
    <button
      className={`inline-flex items-center font-normal justify-center text-base bg-gradient-to-b from-indigo-400 to-sky-300 rounded-md p-[1px] transition-colors ${className}`}
    >
      <div className='bg-dark-2 rounded-md px-4 py-1 whitespace-nowrap'>{children}</div>
    </button>
  );
}
