import React from 'react';
import { useContext, useState } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import FundContext from '../FundBounty/FundContext';
import useWeb3 from '../../hooks/useWeb3';
import TokenFundBox from '../FundBounty/SearchTokens/TokenFundBox';
import ConnectButton from '../WalletConnect/ConnectButton';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import AdminModal from './AdminModal';
const SetBudget = () => {
  const [appState] = useContext(StoreContext);
  const { accountData, openQClient } = appState;
  const [fundState, fundDispatch] = useContext(FundContext);
  const { bounty, token, volume, refreshBounty, error } = fundState;
  const { library, account } = useWeb3();
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [modal, setModal] = useState();
  const setBudget = async () => {
    setModal({ type: 'Loading', inProgress: 'Updating Budget...' });
    try {
      const transaction = await openQClient.setFundingGoal(library, bounty.bountyId, token, volume);
      refreshBounty();
      const volumeDispatch = {
        type: 'SET_VOLUME',
        payload: '',
      };
      fundDispatch(volumeDispatch);
      setModal({
        transaction,
        type: 'Budget',
      });
    } catch (error) {
      appState.logger.error(error, accountData.id, 'adminPage1');
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });

      const errorDispatch = {
        type: 'SET_ERROR',
        payload: {
          message,
          title,
        },
      };
      fundDispatch(errorDispatch);
    }
  };

  const clearError = () => {
    const errorDispatch = {
      type: 'SET_ERROR',
      payload: null,
    };
    fundDispatch(errorDispatch);
  };

  return (
    <>
      {' '}
      {bounty.bountyType !== '3' && (
        <>
          {' '}
          <div className='flex items-center gap-2'>Set a New Budget for this Contract</div>
          <div className='flex-1 items-center w-full px-4'>
            <TokenFundBox />
          </div>
          <ConnectButton nav={false} needsGithub={false} centerStyles={true} />
          {isOnCorrectNetwork && account && (
            <button className='btn-default' type='button' onClick={setBudget}>
              Set New Budget
            </button>
          )}
        </>
      )}
      {modal && <AdminModal bounty={bounty} setModal={setModal} modal={modal} payoutTokenAddress={token.address} />}
      {error && (
        <AdminModal
          setModal={clearError}
          modal={{
            type: 'Error',
            ...error,
          }}
        />
      )}
    </>
  );
};
export default SetBudget;
