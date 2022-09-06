import React, { useState } from 'react';
import TokenSearch from './TokenSearch';
import Image from 'next/image';

const TokenFundBox = ({ onCurrencySelect, onVolumeChange, token, volume, placeholder }) => {
  const [showTokenSearch, setShowTokenSearch] = useState(false);

  return (
    <div className='flex space-x-4'>
      <div className='flex w-full flex-row justify-between items-center px-4 input-field-big'>
        <div className={' bg-dark-mode'}>
          <input
            aria-label='amount'
            className='font-semibold number outline-none bg-dark-mode text-primary w-full'
            autoComplete='off'
            value={volume}
            placeholder={placeholder || '0.0'}
            id='amount'
            onChange={(event) => onVolumeChange(event.target.value)}
          />
        </div>
      </div>
      <div className='flex'>
        <button className='flex flex-row items-center btn-default p-0.5 px-2' onClick={() => setShowTokenSearch(true)}>
          <div className='flex h-4 w-4 items-center justify-center'>
            <Image
              src={token.path || token.logoURI || '/crypto-logos/ERC20.svg'}
              className='rounded-full'
              alt='n/a'
              width='40%'
              height='40%'
            />
          </div>
          <div className='flex pl-2 pr-1 text-primary'>{token.symbol}</div>
          <div className='flex'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='white'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </button>
      </div>
      {showTokenSearch ? (
        <TokenSearch token={token} setShowTokenSearch={setShowTokenSearch} onCurrencySelect={onCurrencySelect} />
      ) : null}
    </div>
  );
};

export default TokenFundBox;
