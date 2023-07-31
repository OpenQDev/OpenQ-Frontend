import React, { useState, useContext, useEffect, useMemo } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import ToolTipNew from '../../Utils/ToolTipNew';
import useWeb3 from '../../../hooks/useWeb3';
import useIsOnCorrectNetwork from '../../../hooks/useIsOnCorrectNetwork';
import ConnectButton from '../../WalletConnect/ConnectButton';
import TokenSearch from '../../TokenSelection/TokenSearch';
import SetTierValues from '../../MintBounty/MintBountyModal/AddContestParams/SetTierValues';
import AdminModal from '../AdminModal';
import TokenContext from '../../TokenSelection/TokenStore/TokenContext';
import { ethers } from 'ethers';

const SetTierAdminPage = ({ bounty, refreshBounty }) => {
  // Context
  const { library, account } = useWeb3();
  const [appState] = useContext(StoreContext);
  const { accountData, openQClient, logger } = appState;
  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;
  const [showTokenSearch, setShowTokenSearch] = useState();

  const [, tokenDispatch] = useContext(TokenContext);
  const [initialVolumes, setInitialVolumes] = useState([]);
  const [finalTierVolumes, setFinalTierVolumes] = useState([]);

  useEffect(() => {
    const depositTokenAddress = bounty?.deposits[0]?.tokenAddress;
    const payoutTokenAddress = bounty?.payoutTokenAddress;
    if (bounty?.bountyType == '3' && bounty?.deposits?.length > 0) {
      const tokenMetadata = appState.tokenClient.getToken(payoutTokenAddress);
      setInitialVolumes(
        bounty.payoutSchedule?.map((p) => {
          return formatVolume(p, tokenMetadata);
        }) || []
      );
      const tokenAddressDispatch = {
        type: 'SET_TOKEN',
        payload: {
          ...appState.tokenClient.getToken(depositTokenAddress),
          address: depositTokenAddress,
        },
      };
      tokenDispatch(tokenAddressDispatch);
    } else if (bounty?.bountyType == '3' && bounty?.payoutSchedule?.length > 0) {
      const tokenMetadata = appState.tokenClient.getToken(payoutTokenAddress);
      setInitialVolumes(
        bounty.payoutSchedule?.map((p) => {
          return formatVolume(p, tokenMetadata);
        }) || []
      );
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

  function formatVolume(tierVolume, token) {
    let bigNumberVolume = ethers.BigNumber.from(tierVolume.toString());
    let decimals = parseInt(token.decimals) || 18;
    let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
    return formattedVolume;
  }

  const zeroAddressMetadata = {
    name: 'Matic',
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'MATIC',
    decimals: 18,
    chainId: 80001,
    path: '/crypto-logos/MATIC.svg',
  };

  // State
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [modal, setModal] = useState({});

  // funding goal volume and token
  // payout volume and token
  const [,] = useState(zeroAddressMetadata);

  // contest state
  const initialTierArr = useMemo(() => {
    if (bounty.payoutSchedule) {
      return bounty.payoutSchedule.map((elem, index) => {
        return index.toString();
      });
    } else return [];
  }, [bounty]);
  const [tier, setTier] = useState(bounty.payoutSchedule?.length);
  const [tierArr, setTierArr] = useState(initialTierArr);

  const [isLoading, setIsLoading] = useState();

  // handle change in Funding Goal

  // handle change in Payout for Ongoing Contracts

  // handle change in Payout for Contests

  function onTierChange(e) {
    const newTier = e.target.value;
    if (newTier >= 0) {
      setTier(parseInt(e.target.value));
    }
    if (newTier > 100) {
      setTier('0');
    }
    const newTierArr = Array.from(
      {
        length: e.target.value,
      },
      (_, i) => i
    );
    setTierArr(newTierArr);

    // removes final tier volumes
    const newFinalTierVolumes = newTierArr.map((tier) => {
      return finalTierVolumes[tier] || 1;
    });
    setFinalTierVolumes(newFinalTierVolumes);
  }

  // trigger smart contracts

  async function disableKYC() {
    setModal({ type: 'Loading', inProgress: 'Disabling KYC...' });
    try {
      setIsLoading(true);

      let transaction;

      transaction = await openQClient.setKycRequired(library, bounty.bountyId, false);
      refreshBounty();
      setModal({
        transaction,
        type: 'KYC',
      });
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
    setIsLoading(false);
  }

  async function disableInvoice() {
    setModal({ type: 'Loading', inProgress: 'Disabling Invoice...' });
    try {
      setIsLoading(true);

      let transaction;

      transaction = await openQClient.setInvoiceRequired(library, bounty.bountyId, false);
      refreshBounty();
      setModal({
        transaction,
        type: 'KYC',
      });
    } catch (error) {
      logger.error(error, accountData.id, 'adminPage4');
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });

      setModal({
        type: 'Error',
        message,
        title,
      });
    }
    setIsLoading(false);
  }

  async function disableSupportingDocumentsRequired() {
    setModal({ type: 'Loading', inProgress: 'Disabling Invoice...' });
    try {
      setIsLoading(true);

      let transaction;

      transaction = await openQClient.setSupportingDocumentsRequired(library, bounty.bountyId, false);
      refreshBounty();
      setModal({
        transaction,
        type: 'KYC',
      });
    } catch (error) {
      logger.error(error, accountData.id, 'adminPage5');
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });

      setModal({
        type: 'Error',
        message,
        title,
      });
    }
    setIsLoading(false);
  }

  async function setPayoutSchedule() {
    setModal({ type: 'Loading', inProgress: 'Updating Payout Schedule...' });
    try {
      setIsLoading(true);

      let transaction;

      if (bounty.bountyType === '3') {
        transaction = await openQClient.setPayoutScheduleFixed(library, bounty.bountyId, finalTierVolumes, token);
      }
      refreshBounty();
      setModal({
        transaction,
        type: 'PayoutSchedule',
        finalTierVolume: finalTierVolumes,
        payoutTokenAddress: token.address,
      });
    } catch (error) {
      logger.error(error, accountData.id, 'adminPage2');
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });

      setModal({
        type: 'Error',
        message,
        title,
      });
    }
    setIsLoading(false);
  }

  return (
    <>
      {bounty.bountyType === '3' && (
        <>
          <div className=' flex flex-col gap-4'>
            <div className=' w-11/12 text-base flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                How many Tiers?
                <ToolTipNew
                  mobileX={10}
                  toolTipText={`How many people will be able to claim a prize? Don't exceed 100.`}
                >
                  <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                    ?
                  </div>
                </ToolTipNew>
              </div>
              <div className='flex-1 w-full mt-2'>
                <input
                  className={'flex-1 ml-4 input-field w-full'}
                  id='name'
                  placeholder='0'
                  autoComplete='off'
                  type='text'
                  min='0'
                  max='100'
                  defaultValue={tier}
                  onChange={(e) => onTierChange(e)}
                />
              </div>
            </div>

            <div className='flex flex-col w-11/12 items-start py-2 gap-2 text-base pb-4'>
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-2'>
                  Which token?
                  <ToolTipNew mobileX={10} toolTipText={'Fixed contests can only be funded with one token.'}>
                    <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square text-sm leading-4 h-4 box-content text-center font-bold text-primary'>
                      ?
                    </div>
                  </ToolTipNew>
                </div>
              </div>
              <div className=' pl-4'>
                <TokenSearch
                  setShowTokenSearch={setShowTokenSearch}
                  showTokenSearch={showTokenSearch}
                  alone={true}
                  bounty={bounty}
                />
              </div>
            </div>

            <div>Volumes:</div>
            <SetTierValues
              initialVolumes={initialVolumes}
              finalTierVolumes={finalTierVolumes}
              setFinalTierVolumes={setFinalTierVolumes}
              tierArr={tierArr}
              adminPage={true}
            />
          </div>
          <ConnectButton
            nav={false}
            needsGithub={false}
            centerStyles={true}
            tooltipAction={'set a new payout schedule.'}
          />
          {isOnCorrectNetwork && account && (
            <div className='px-4'>
              <button
                className={`w-full btn-default cursor-pointer`}
                type='button'
                onClick={setPayoutSchedule}
                disabled={isLoading}
              >
                Set New Payout Schedule
              </button>
            </div>
          )}
          {isOnCorrectNetwork && account && (
            <div className='px-4'>
              <button
                className={`w-full btn-default cursor-pointer`}
                type='button'
                onClick={disableKYC}
                disabled={isLoading}
              >
                Disable KYC
              </button>
            </div>
          )}
          {isOnCorrectNetwork && account && (
            <div className='px-4'>
              <button
                className={`w-full btn-default cursor-pointer`}
                type='button'
                onClick={disableInvoice}
                disabled={isLoading}
              >
                Disable Invoice
              </button>
            </div>
          )}
          {isOnCorrectNetwork && account && (
            <div className='px-4'>
              <button
                className={`w-full btn-default cursor-pointer`}
                type='button'
                onClick={disableSupportingDocumentsRequired}
                disabled={isLoading}
              >
                Disable Supporting Documents Required
              </button>
            </div>
          )}
          <AdminModal tokenAddress={token.address} setModal={setModal} bounty={bounty} modal={modal} />
        </>
      )}
    </>
  );
};
export default SetTierAdminPage;
