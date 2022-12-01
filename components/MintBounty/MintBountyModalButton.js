import React from 'react';
import LoadingIcon from '../Loading/ButtonLoadingIcon';

export default function MintBountyModalButton({ enableMint, transactionPending, mintBounty }) {
  return (
    <button
      className={`${enableMint ? 'btn-primary cursor-pointer' : 'btn-primary cursor-not-allowed'}`}
      type='button'
      onClick={() => mintBounty()}
      disabled={!enableMint}
    >
      {transactionPending ? (
        <div className='flex items-center gap-2'>
          Processing... <LoadingIcon bg='colored' />
        </div>
      ) : (
        'Deploy Contract'
      )}
    </button>
  );
}
