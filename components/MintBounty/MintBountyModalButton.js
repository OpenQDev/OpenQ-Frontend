import React from 'react';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import chainIdDeployEnvMap from '../../components/WalletConnect/chainIdDeployEnvMap';

export default function MintBountyModalButton({
  enableMint,
  transactionPending,
  mintBounty,
  account,
  isOnCorrectNetwork,
}) {
  return (
    <div className='flex flex-row w-full h-[38px] justify-center'>
      <button
        className={`flex w-full items-center justify-center ${
          enableMint || !isOnCorrectNetwork ? 'btn-primary cursor-pointer' : 'btn-primary cursor-not-allowed'
        }`}
        type='button'
        onClick={() => mintBounty()}
        disabled={!enableMint && isOnCorrectNetwork}
      >
        {transactionPending ? (
          <LoadingIcon bg='colored' />
        ) : !isOnCorrectNetwork ? (
          `Use ${chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['networkName']} Network`
        ) : account ? (
          'Deploy Contract'
        ) : (
          'Connect Wallet'
        )}
      </button>
    </div>
  );
}
