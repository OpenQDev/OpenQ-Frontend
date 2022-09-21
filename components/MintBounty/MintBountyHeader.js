import React from 'react';

export default function MintBountyHeader({ category }) {
  return (
    <div className='flex flex-col items-center justify-center p-5 pb-3 rounded-t'>
      <h3 className='text-3xl text-center font-semibold'>Deploy {category} Contract</h3>
      <h3 className='text-2xl pt-2 text-center text-gray-300'>
        {category === 'Split Price'
          ? 'Pay out a fixed amount to any contributors who submit work to this bounty, as many times as you like'
          : `Create a${category === 'Fixed price' ? 'n' : ''} ${category} Contract to send funds to any GitHub issue`}
      </h3>
    </div>
  );
}
