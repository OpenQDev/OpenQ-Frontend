import React from 'react';
import Image from 'next/image';

const TokenDisplay = ({ token, onSelect, showCursor }) => {
  return (
    <div className={`flex flex-row ${showCursor && 'cursor-pointer'} space-x-4 pb-3`} onClick={() => onSelect(token)}>
      <div className='pt-2 h-8 w-6'>
        <Image
          src={token.logoURI || token.path || '/crypto-logos/ERC20.svg'}
          className='rounded-full'
          alt='n/a'
          width='25%'
          height='25%'
        />
      </div>
      <div className='flex flex-col'>
        <div className='font-bold truncate'>{token.symbol}</div>
        <div className='text-sm text-gray-200 truncate w-32'>{token.name}</div>
      </div>
    </div>
  );
};

export default TokenDisplay;
