import React, { useContext, useState, useMemo } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import { RESTING, CONFIRM, TRANSFERRING, SUCCESS, ERROR } from './SelectWinnerState';
import ToolTip from '../Utils/ToolTipNew';
import ModalDefault from '../Utils/ModalDefault';
import { ethers } from 'ethers';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import { formatVolume } from '../../services/utils/lib';

const WinnerSelect = ({ prize, bounty, refreshBounty, pr, disabled }) => {
  const [showModal, setShowModal] = useState();
  const [selectionState, setSelectionState] = useState(RESTING);
  const tierIndex = parseInt(prize.index);
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { library } = useWeb3();
  const winnerId = pr.author.id;
  const [error, setError] = useState({});
  const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances);
  const price = tokenValues?.total;
  const createFixedPayout = () => {
    return prize.payout && bounty.bountyType == 3
      ? {
          tokenAddress: bounty.payoutTokenAddress,
          volume: prize.payout,
        }
      : null;
  };
  const payoutBalances = useMemo(() => createFixedPayout(), [prize]);
  const [fixedPayoutValue] = useGetTokenValues(payoutBalances);
  const claimReady = !bounty.kycRequired && !bounty.supportingDocumentsRequired && !bounty.invoiceRequired;

  let unit;
  const claimBounty = async () => {
    try {
      setSelectionState(TRANSFERRING);

      const transaction = await appState.openQClient.setTierWinner(library, bounty.bountyId, tierIndex, winnerId);
      if (transaction) {
        setSelectionState(SUCCESS);
      }
    } catch (err) {
      appState.logger.error(err, accountData.id, 'WinnerSelect.js1');
      const { message, title } = appState.openQClient.handleError(err, {
        bounty,
      });
      setError({ message, title });
      setSelectionState(ERROR);
    }
  };
  if (bounty.payoutTokenAddress) {
    unit = ` ${appState.tokenClient.getToken(bounty.payoutTokenAddress).name}`;
  }

  const suffixed = appState.utils.handleSuffix(tierIndex + 1);
  const prizeColor = appState.utils.getPrizeColor(tierIndex);
  const selectWinner = () => {
    if (prize.claimed) {
      return;
    }
    setSelectionState(CONFIRM);
    setShowModal(true);
  };
  const resetState = () => {
    setSelectionState(CONFIRM);
    if (typeof refreshBounty === 'function') {
      refreshBounty();
    }
    setShowModal();
  };
  const checkIsSolvent = (tokenBalances, currentPayout) => {
    if (bounty.bountyType == 3) {
      const tokenBalancesOfTarget = tokenBalances.find((tokenBalance) => {
        return tokenBalance.tokenAddress === currentPayout?.tokenAddress?.toLowerCase();
      });

      if (tokenBalancesOfTarget) {
        let bigNumberBalance = ethers.BigNumber.from(tokenBalancesOfTarget.volume);
        const bigNumberPayout = ethers.BigNumber.from(currentPayout?.volume);
        const isSolvent = bigNumberBalance.gte(bigNumberPayout);
        return isSolvent;
      }
    } else {
      return true;
    }
  };
  const totalPayoutsScheduled = bounty.payoutSchedule?.reduce((acc, payout) => {
    return ethers.BigNumber.from(acc).add(ethers.BigNumber.from(payout));
  });

  const isSolvent = checkIsSolvent(bounty.bountyTokenBalances, {
    tokenAddress: bounty.payoutTokenAddress,
    volume: totalPayoutsScheduled,
  });

  const goBackBtn = {
    CONFIRM: (
      <button className=' btn-danger' onClick={resetState}>
        {' '}
        Go Back{' '}
      </button>
    ),
  };
  const confirmBtn = {
    CONFIRM: (
      <ToolTip
        innerStyles={'  whitespace-pre-wrap'}
        relativePosition={'-right-4 w-32 md:right:auto md:w-60'}
        hideToolTip={isSolvent}
        toolTipText={`You don't have enough funds escrowed to cover this contest, please make a deposit.`}
      >
        <button
          disabled={disabled || !isSolvent}
          className={!disabled && isSolvent ? 'btn-primary' : 'btn-default cursor-not-allowed'}
          onClick={claimBounty}
        >
          Confirm
        </button>
      </ToolTip>
    ),
    TRANSFERRING: (
      <button onClick={() => resetState()} className='btn-default'>
        Close
      </button>
    ),
    ERROR: (
      <button onClick={() => resetState()} className='btn-default'>
        Close
      </button>
    ),
    SUCCESS: (
      <button onClick={() => resetState()} className='btn-default'>
        Close
      </button>
    ),
  };
  const modalTitle = {
    CONFIRM: `Choosing ${suffixed} Tier`,
    TRANSFERRING: `Selecting Winner...`,
    SUCCESS: 'Winner Selected!',
    ERROR: error.title,
  };
  return (
    <>
      <button
        data-testid='winnerSelect'
        onClick={selectWinner}
        disabled={prize.claimed || disabled}
        className={`flex justify-center ${
          prize.claimed || disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } text-black content-center items-center font-semibold`}
        style={{
          backgroundColor: (!prize.claimed && !disabled) || disabled ? prizeColor : '#4f4f4f',
        }}
      >
        <div>
          {formatVolume(prize.payout, appState.tokenClient.getToken(bounty.payoutTokenAddress)) + unit}{' '}
          {bounty.tierWinners?.[tierIndex] && '(selected)'}
        </div>
      </button>
      {showModal && (
        <ModalDefault
          footerLeft={goBackBtn[selectionState]}
          footerRight={confirmBtn[selectionState]}
          resetState={resetState}
          title={modalTitle[selectionState]}
          setShowModal={setShowModal}
        >
          {selectionState === CONFIRM && (
            <>
              <p className='my-2'>
                You are about to select{' '}
                <a href={pr.url} className='underline'>
                  {pr.title}
                </a>{' '}
                as {suffixed} tier for the{' '}
                <a className='underline' href={bounty.url}>
                  {bounty.title}
                </a>{' '}
                challenge.
              </p>
              <p className='my-2'>
                {claimReady ? 'This will release' : 'Before being able to claim'}{' '}
                {bounty.bountyType === '2'
                  ? prize.payout + '% of funds'
                  : formatVolume(prize.payout, appState.tokenClient.getToken(bounty.payoutTokenAddress)) + unit}{' '}
                (
                {bounty.bountyType === '2'
                  ? appState.utils.formatter.format((price * prize.payout) / 100 || 0)
                  : appState.utils.formatter.format(fixedPayoutValue?.total || 0)}
                )
                {claimReady ? (
                  ` to ${pr.author.login}, to be claimed at their leisure.`
                ) : (
                  <>
                    {', '}
                    {pr.author.login} will have to complete:
                    <ul className='mt-2 ml-4 list-disc'>
                      {bounty.invoiceRequired && <li>Invoice</li>}
                      {bounty.supportingDocumentsRequired && <li>W8/W9 Form</li>}
                      {bounty.kycRequired && <li>KYC</li>}
                    </ul>
                  </>
                )}
              </p>
            </>
          )}
          {selectionState === TRANSFERRING && (
            <div className='flex items-center gap-2'>
              Your request is being processed... <LoadingIcon />
            </div>
          )}
          {selectionState === ERROR && <p>{error.message}</p>}
          {selectionState === SUCCESS && (
            <>
              <p className='my-2'>
                {bounty.bountyType === '2'
                  ? prize.payout + '% of funds'
                  : formatVolume(prize.payout, appState.tokenClient.getToken(bounty.payoutTokenAddress)) + unit}{' '}
                staked on this competition can now be claimed by {pr.author.name || pr.author.login},
                <>
                  {' '}
                  after they complete the following:
                  <ul className='mt-2 ml-4 list-disc'>
                    {bounty.invoiceRequired && <li>Invoice</li>}
                    {bounty.supportingDocumentsRequired && <li>W8/W9 Form</li>}
                    {bounty.kycRequired && <li>KYC</li>}
                  </ul>
                </>
              </p>
            </>
          )}
        </ModalDefault>
      )}
    </>
  );
};
export default WinnerSelect;
