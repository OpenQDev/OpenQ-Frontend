import React, { useContext, useState } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import { ethers } from 'ethers';
import StoreContext from '../../store/Store/StoreContext';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import TokenFundBox from '../FundBounty/SearchTokens/TokenFundBox';
import ConnectButton from '../WalletConnect/ConnectButton';
import AdminModal from './AdminModal';

const SetBudgetAdminPage = ({ refreshBounty, bounty }) => {
  const [appState] = useContext(StoreContext);
  const zeroAddressMetadata = {
    name: 'Matic',
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'MATIC',
    decimals: 18,
    chainId: 80001,
    path: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
  };
  const [token, setToken] = useState(zeroAddressMetadata);
  const [volume, setVolume] = useState('');
  const { openQClient, accountData, utils, logger } = appState;
  const [modal, setModal] = useState({});
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const { account, library } = useWeb3();
  async function setBudget() {
    setModal({ type: 'Loading', inProgress: 'Updating Budget...' });
    try {
      const transaction = await openQClient.setFundingGoal(library, bounty.bountyId, token, volume);
      refreshBounty();
      setVolume('');
      setModal({
        transaction,
        type: 'Budget',
      });
    } catch (error) {
      logger.error(error, accountData.id, 'adminPage1');
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });
      setModal({
        message,
        title,
        type: 'Error',
      });
    }
  }

  function onCurrencySelect(token) {
    setToken({
      ...token,
      address: ethers.utils.getAddress(token.address),
    });
  }

  function onVolumeChange(volume) {
    utils.updateVolume(volume, setVolume);
  }

  return (
    <>
      {bounty.bountyType !== '3' && (
        <>
          {' '}
          <div className='flex items-center gap-2'>Set a New Budget for this Contract</div>
          <div className='flex-1 items-center w-full px-4'>
            <TokenFundBox
              onCurrencySelect={onCurrencySelect}
              onVolumeChange={onVolumeChange}
              token={token}
              volume={volume}
            />
          </div>
          <ConnectButton nav={false} needsGithub={false} centerStyles={true} />
          {isOnCorrectNetwork && account && (
            <button className='btn-default' type='button' onClick={setBudget}>
              Set New Budget
            </button>
          )}
        </>
      )}

      <AdminModal setModal={setModal} tokenAddress={token.tokenAddress} bounty={bounty} modal={modal} />
    </>
  );
};
export default SetBudgetAdminPage;
