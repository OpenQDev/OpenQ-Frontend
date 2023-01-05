// Third party Libraries
import React, { useState, useContext, useEffect } from 'react';
import AdminModal from '../AdminModal';
import TokenFundBox from '../../TokenSelection/TokenFundBox';
import ConnectButton from '../../WalletConnect/ConnectButton';
import StoreContext from '../../../store/Store/StoreContext';
import useWeb3 from '../../../hooks/useWeb3';
import useIsOnCorrectNetwork from '../../../hooks/useIsOnCorrectNetwork';
import TokenContext from '../../TokenSelection/TokenStore/TokenContext';

const SetPayoutAdminPage = ({ bounty, refreshBounty, setShowButton }) => {
  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;
  const [payoutVolume, setPayoutVolume] = useState('');
  const [appState] = useContext(StoreContext);
  const [modal, setModal] = useState({});
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const { library, account } = useWeb3();
  const { accountData, utils, openQClient, logger } = appState;

  const [, tokenDispatch] = useContext(TokenContext);
  useEffect(() => {
    const depositTokenAddress = bounty?.deposits[0]?.tokenAddress;
    if (bounty?.bountyType == '1' && bounty?.deposits?.length > 0) {
      const tokenAddressDispatch = {
        type: 'SET_TOKEN',
        payload: {
          ...appState.tokenClient.getToken(depositTokenAddress),
          address: depositTokenAddress,
        },
      };
      tokenDispatch(tokenAddressDispatch);
    }
  }, [bounty]);

  function onPayoutVolumeChange(payoutVolume) {
    utils.updateVolume(payoutVolume, setPayoutVolume);
  }

  // handle change in Payout for Contests

  // useEffect

  // trigger smart contracts

  async function setPayout() {
    setModal({ type: 'Loading', inProgress: 'Updating Payout...' });
    try {
      const transaction = await openQClient.setPayout(library, bounty.bountyId, token, payoutVolume);
      refreshBounty();
      setPayoutVolume('');
      setModal({
        transaction,
        type: 'Payout',
      });
    } catch (error) {
      logger.error(error, account, bounty.id);
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });
      setModal({
        type: 'Error',
        message,
        title,
      });
    }
  }

  async function closeOngoing() {
    setModal({ type: 'Loading', inProgress: 'Closing Split Price Contract...' });
    try {
      const transaction = await openQClient.closeOngoing(library, bounty.bountyId);

      setModal({
        transaction,
        type: 'Closed Split Price',
      });
      setShowButton(false);
      refreshBounty();
    } catch (error) {
      logger.error(error, accountData.id, 'adminPage3');
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });
      setModal({
        type: 'Error',
        message,
        title,
      });
    }
  }
  return (
    <>
      {bounty.bountyType == '1' ? (
        <>
          <div className='flex items-center gap-2'>Set Payout for Each Submitter</div>

          <div className='flex-1 items-center w-full mt-2'>
            <TokenFundBox onVolumeChange={onPayoutVolumeChange} volume={payoutVolume} bounty={bounty} />
          </div>
          <ConnectButton nav={false} needsGithub={false} centerStyles={true} />
          {isOnCorrectNetwork && account && (
            <button className='btn-default' type='button' onClick={setPayout}>
              Set Payout
            </button>
          )}

          <h2 className='text-2xl text-[#f85149] border-b border-gray-700 pb-4'>Close Split Price Contract</h2>
          <div className='flex justify-between items-center gap-2'>
            Once you close this split price contract, there is no going back. Please be certain.
          </div>
          <ConnectButton nav={false} needsGithub={false} centerStyles={true} />
          {isOnCorrectNetwork && account && (
            <button className='btn-danger' type='button' onClick={closeOngoing}>
              Close Split Price Contract
            </button>
          )}
        </>
      ) : null}
      <AdminModal setModal={setModal} bounty={bounty} modal={modal} tokenAddress={token.address} />
    </>
  );
};
export default SetPayoutAdminPage;
