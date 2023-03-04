import React, { useState } from 'react';
import TokenSearch from '../TokenSearch';
import SelectedTokenImg from '../SelectedTokenImg';
import ModalDefault from '../../Utils/ModalDefault';

const TokenFundBox = ({
  onVolumeChange,
  volume,
  bounty,
  placeholder,
  label,
  styles,
  small,
  mustChangePayoutFirst,
  setInternalMenu,
}) => {
  const [showTokenSearch, setShowTokenSearch] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const bountyTokenLocked = (bounty?.bountyType == 1 || bounty?.bountyType == 3) && bounty?.deposits?.length > 0;
  const btn = (
    <div className='flex gap-2'>
      <button className='btn-default' onClick={() => setShowPayoutModal(false)}>
        I understand
      </button>
      <button className='btn-primary' onClick={() => setInternalMenu('Admin')}>
        Update Token
      </button>
    </div>
  );

  return (
    <div className={`flex space-x-4 w-full ${styles}`}>
      <div className={`w-full flex ${small ? 'w-52' : 'w-full'} flex-row justify-between items-center px-4 input-field-big`}>
        <div className={'w-full bg-dark-mode'}>
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
          className={`flex flex-row items-center p-0.5 px-2 ${!bountyTokenLocked ? 'btn-default' : 'cursor-default'}`}
          onClick={mustChangePayoutFirst ? () => setShowPayoutModal(true) : () => setShowTokenSearch(true)}
          disabled={bountyTokenLocked}
        >
          <SelectedTokenImg />

          {!bountyTokenLocked && (
            <div className='flex'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                viewBox='0 0 20 20'
                width='20'
                height='20'
                fill='white'
              >
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
      {showTokenSearch ? <TokenSearch setShowTokenSearch={setShowTokenSearch} /> : null}
      {showPayoutModal ? (
        <ModalDefault
          setShowModal={setShowPayoutModal}
          title='Update your reward token first!'
          footerRight={btn}
          resetState={() => {}}
        >
          <div>
            If you want to change the token used for your deposit, you first need to update the token used for the
            reward (on the admin tab) so that it uses that specific token for payouts. Once you have made a deposit, you
            won't be able to change the token for deposits or payouts going forward.
          </div>
        </ModalDefault>
      ) : null}
    </div>
  );
};

export default TokenFundBox;
