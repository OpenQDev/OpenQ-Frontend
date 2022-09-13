import React from 'react';
import LoadingIcon from '../Loading/ButtonLoadingIcon';

export default function MintBountyModalButton({ enableMint, transactionPending, mintBounty, account }) {
  return (
    <div className='flex flex-row w-full justify-center'>
      <button
        className={`flex w-full items-center justify-center ${
          enableMint ? 'btn-primary cursor-pointer' : 'btn-primary cursor-not-allowed'
        }`}
        type='button'
        onClick={() => mintBounty()}
        disabled={!enableMint}
      >
        {transactionPending ? <LoadingIcon bg='colored' /> : account ? 'Deploy Contract' : 'Connect Wallet'}
      </button>
    </div>
  );
}
