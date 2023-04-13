import React from 'react';

export default function Search() {
  return (
    <div className='flex bg-dark-2 bg-opacity-75 px-3 py-2 w-full border border-dark-1 rounded-sm space-x-3'>
      <input
        className='bg-dark-4 border border-dark-1 rounded-sm px-3 py-2 grow min-w-0 outline-none'
        placeholder='Search'
      />
      <button>Ctrl K</button>
    </div>
  );
}
