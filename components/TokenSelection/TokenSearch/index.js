// Third party
import React, { useContext, useState } from 'react';
import TokenList from '../TokenList';
import { XIcon } from '@primer/octicons-react';
import TokenContext from '../TokenStore/TokenContext';
import Image from 'next/legacy/image';

const TokenSearch = ({ stream, setShowTokenSearch, alone, showTokenSearch, bounty }) => {
  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;
  const [tokenSearchTerm, setTokenSearchTerm] = useState();
  const lists = {
    openq: !stream,
    superTokens: stream,
  };
  const [showStreamTokenSearch, setShowStreamTokenSearch] = useState(false);
  const bountyTokenLocked = (bounty?.bountyType == 1 || bounty?.bountyType == 3) && bounty?.deposits?.length > 0;
  const handleShowSearch = (bool) => {
    if (stream || alone) {
      setShowStreamTokenSearch(bool);
    }
    if (alone || !stream) {
      setShowTokenSearch(bool);
    }
  };
  function handleOutsideClick() {
    handleShowSearch(false);
  }

  return (
    <div className='justify-self-end'>
      <div>
        <button
          className={`flex flex-row items-center space-x-1 py-2 p-2 pr-2 ${
            !bountyTokenLocked ? 'btn-default' : 'cursor-default'
          }`}
          onClick={() => handleShowSearch(true)}
          disabled={bountyTokenLocked}
        >
          <div className='flex flex-row space-x-5 items-center justify-center'>
            <div className='h-1 w-6 pb-6'>
              <Image
                src={token.path || token.logoURI || '/crypto-logos/ERC20.svg'}
                className='rounded-sm'
                alt='n/a'
                width={40}
                height={40}
              />
            </div>
          </div>
          <div className='pl-3 '>{token.symbol}</div>
          {!bountyTokenLocked && (
            <div>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='white'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          )}
        </button>
      </div>
      {((!stream && !alone) || showStreamTokenSearch) && (
        <div
          onClick={handleOutsideClick}
          className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 left-20 z-50 outline-none focus:outline-none
          ${showStreamTokenSearch && 'visible'}
          `}
        >
          <div className='w-5/6 max-w-md'>
            {' '}
            <div
              onClick={(e) => e.stopPropagation()}
              className='flex justify-left border border-border-gray pl-8 pr-8 pt-5 pb-3 rounded-sm shadow-lg flex-col w-full bg-dark-mode outline-none focus:outline-none'
            >
              <div className='h-[30rem]'>
                <div className='flex flex-row items-center justify-between rounded-t pt-2 pb-4'>
                  <h3 className='flex text-1xl font-semibold'>Select a Token</h3>
                  <button className='flex text-3xl hover:text-tinted' onClick={() => handleShowSearch(false)}>
                    <XIcon size={16} />
                  </button>
                </div>

                <div className='pt-3 pb-3 pl-4 input-field overflow-hidden mb-2'>
                  <div className=''>
                    <div className='justify-start '>
                      <input
                        className='outline-none bg-transparent '
                        onKeyUp={(e) => setTokenSearchTerm(e.target.value)}
                        type='text'
                        placeholder='Search name'
                      ></input>
                    </div>
                  </div>
                </div>
                <div className='mt-8 overflow-auto h-72 text-primary'>
                  <TokenList lists={lists} tokenSearchTerm={tokenSearchTerm} setShowTokenSearch={handleShowSearch} />
                </div>
                <div className='flex flex-col justify-items-center  justify-end border-t border-gray-700 '></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!stream && (!alone || showTokenSearch) && <div className='fixed inset-0 z-10 bg-overlay'></div>}
    </div>
  );
};

export default TokenSearch;
