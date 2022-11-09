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
    <button
      className={`${
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
  );
}
