import React, { useContext, useEffect, useState } from 'react';
import useWeb3 from '../../../hooks/useWeb3';
import StoreContext from '../../../store/Store/StoreContext';
import useIsOnCorrectNetwork from '../../../hooks/useIsOnCorrectNetwork';
import TokenFundBox from '../../TokenSelection/TokenFundBox';
import ConnectButton from '../../WalletConnect/ConnectButton';
import AdminModal from '../AdminModal';
import TokenContext from '../../TokenSelection/TokenStore/TokenContext';

const SetBudgetAdminPage = ({ refreshBounty, bounty }) => {
  const [appState] = useContext(StoreContext);

  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;
  const [volume, setVolume] = useState('');
  const { openQClient, accountData, utils, logger } = appState;
  const [modal, setModal] = useState({});
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const { account, library } = useWeb3();

  const [, tokenDispatch] = useContext(TokenContext);
  useEffect(() => {
    const depositTokenAddress = bounty?.deposits[0]?.tokenAddress;
    const payoutTokenAddress = bounty?.payoutTokenAddress;
    if (bounty?.bountyType == '1' && bounty?.deposits?.length > 0) {
      const tokenAddressDispatch = {
        type: 'SET_TOKEN',
        payload: {
          ...appState.tokenClient.getToken(depositTokenAddress),
          address: depositTokenAddress,
        },
      };
      tokenDispatch(tokenAddressDispatch);
    } else if (bounty?.bountyType == '1' && bounty?.payoutTokenVolume > 0) {
      const tokenAddressDispatch = {
        type: 'SET_TOKEN',
        payload: {
          ...appState.tokenClient.getToken(payoutTokenAddress),
          address: payoutTokenAddress,
        },
      };
      tokenDispatch(tokenAddressDispatch);
    }
  }, [bounty]);

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

  function onVolumeChange(volume) {
    utils.updateVolume(volume, setVolume);
  }

  return (
    <>
      {bounty.bountyType !== '3' && (
        <>
          {' '}
          <div className='flex items-center gap-2'>Set a New Budget for this Contract</div>
          <div className='flex-1 items-center w-full mt-2'>
            <TokenFundBox onVolumeChange={onVolumeChange} volume={volume} bounty={bounty} />
          </div>
          <ConnectButton nav={false} needsGithub={false} centerStyles={true} tooltipAction={'set a new budget.'} />
          {isOnCorrectNetwork && account && (
            <button className='btn-default' type='button' onClick={setBudget}>
              Set New Budget
            </button>
          )}
        </>
      )}

      <AdminModal setModal={setModal} tokenAddress={token.address} bounty={bounty} modal={modal} />
    </>
  );
};
export default SetBudgetAdminPage;
