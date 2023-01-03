import React, { useState } from 'react';
import TokenSearch from '../TokenSearch';
import SelectedTokenImg from '../SelectedTokenImg';

const TokenFundBox = ({ onVolumeChange, volume, placeholder, label, styles, small }) => {
  const [showTokenSearch, setShowTokenSearch] = useState(false);

  return (
    <div className={`flex space-x-4 w-full ${styles}`}>
      <div className={`flex ${small ? 'w-52' : 'w-full'} flex-row justify-between items-center px-4 input-field-big`}>
        <div className={' bg-dark-mode'}>
          <input
            aria-label={label || 'amount'}
            className='font-semibold number outline-none bg-input-bg text-primary w-full'
            autoComplete='off'
            value={volume}
            placeholder={placeholder || '0.0'}
            id='amount'
            onChange={(event) => onVolumeChange(event.target.value)}
          />
        </div>
      </div>
      <div className='flex'>
        <button
          aria-label='select token'
          className='flex flex-row items-center btn-default p-0.5 px-2'
          onClick={() => setShowTokenSearch(true)}
        >
          <SelectedTokenImg />

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
      {showTokenSearch ? <TokenSearch setShowTokenSearch={setShowTokenSearch} /> : null}
    </div>
  );
};

export default TokenFundBox;
