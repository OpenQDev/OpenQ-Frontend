import React, { useContext, useEffect, useState, useMemo } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import { RESTING, CONFIRM, TRANSFERRING, SUCCESS, ERROR } from '../FundBounty/ApproveFundState';
import ToolTip from '../Utils/ToolTipNew';
import ModalDefault from '../Utils/ModalDefault';
import { ethers } from 'ethers';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const WinnerSelect = ({ prize, bounty, refreshBounty, numberOfPayouts, pr, disabled }) => {
  const [showModal, setShowModal] = useState();
  const [selectionState, setSelectionState] = useState(RESTING);
  const height = (100 / numberOfPayouts) * (numberOfPayouts - prize.index);
  const tierIndex = parseInt(prize.index);
  const [appState] = useContext(StoreContext);
  const { account, library } = useWeb3();
  const [user, setUser] = useState({});
  const [closer, setCloser] = useState('');
  const [error, setError] = useState({});
  const zeroAddress = '0x0000000000000000000000000000000000000000';
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

  let unit;
  useEffect(() => {
    const getAddress = async () => {
      const userId = pr.author.id;
      if (library) {
        const closer = await appState.openQClient.getAddressById(library, userId);
        if (ethers.utils.isAddress(closer) && closer !== zeroAddress) {
          setCloser(closer);
        }
      }
      setUser({ id: pr.author.id, login: pr.author.login });
    };
    getAddress();
  }, [library, pr]);

  const claimBounty = async () => {
    try {
      setSelectionState(TRANSFERRING);
      const transaction = await appState.openQClient.claimBounty(
        library,
        bounty.bountyAddress,
        closer,
        pr.url,
        tierIndex,
        user.id,
        user.login
      );
      if (transaction) {
        setSelectionState(SUCCESS);
      }
    } catch (err) {
      appState.logger.error(err, account, bounty.id);
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

  function formatVolume(fixedPayout) {
    const tokenMetadata = appState.tokenClient.getToken(bounty.payoutTokenAddress);
    let bigNumberVolume = ethers.BigNumber.from(fixedPayout.toString());
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
    return formattedVolume;
  }

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
        hideToolTip={closer && isSolvent}
        toolTipText={
          isSolvent
            ? 'Winner needs to register their Github account on OpenQ with a wallet address before paying out.'
            : `You don't have enough funds escrowed to cover this contest, please make a deposit.`
        }
      >
        <button
          disabled={!closer || disabled || !isSolvent}
          className={closer && !disabled && isSolvent ? 'btn-primary' : 'btn-default cursor-not-allowed'}
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
    CONFIRM: `Choosing ${suffixed} Place`,
    TRANSFERRING: `Transferring Funds...`,
    SUCCESS: 'Winner Selected and Payed!',
    ERROR: error.title,
  };
  return (
    <>
      <button
        data-testid='winnerSelect'
        onClick={selectWinner}
        disabled={prize.claimed || disabled}
        className={`flex justify-center hover:scale-110 ${
          prize.claimed || disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-200'
        } text-black content-center items-center w-full`}
        style={{
          height: `${height}px`,
          transform: `translateY(${100 - height}px)`,
          transformOrigin: 'left center',
          backgroundColor: (!prize.claimed && !disabled) || disabled ? prizeColor : '#4f4f4f',
        }}
      >
        <div> {tierIndex + 1}</div>
        <div id='mike' className='fixed inset-0'></div>
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
                as {suffixed} place for the{' '}
                <a className='underline' href={bounty.url}>
                  {bounty.title}
                </a>{' '}
                challenge.
              </p>
              {closer && closer != zeroAddress ? (
                <p className='my-2'>
                  This will automaticaly send{' '}
                  {bounty.bountyType === '2' ? prize.payout + '% of funds' : formatVolume(prize.payout) + unit} staked
                  on this competition (
                  {bounty.bountyType === '2'
                    ? appState.utils.formatter.format((price * prize.payout) / 100)
                    : appState.utils.formatter.format(fixedPayoutValue?.total)}
                  ) to the author of this submission, at the following address:{' '}
                  {`${closer.slice(0, 4)}...${closer.slice(39)}`} .
                </p>
              ) : (
                <p className='my-2'>
                  However, the user has not registered their Github account on OpenQ with a wallet address, please have
                  them register a wallet address before paying out.
                </p>
              )}
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
                {bounty.bountyType === '2' ? prize.payout + '% of funds' : formatVolume(prize.payout) + unit} staked on
                this competition have been sent to {pr.author.name || pr.author.login} at {closer.slice(0, 4)}
                ...{closer.slice(39)} .
              </p>
            </>
          )}
        </ModalDefault>
      )}
    </>
  );
};
export default WinnerSelect;
