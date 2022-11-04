import React, { useContext, useEffect, useState } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import { RESTING, CONFIRM, TRANSFERRING, SUCCESS, ERROR } from '../FundBounty/ApproveFundState';
import ToolTip from '../Utils/ToolTipNew';
import ModalDefault from '../Utils/ModalDefault';

const WinnerSelect = ({ prize, bounty, refreshBounty, numberOfPayouts, pr }) => {
  const [showModal, setShowModal] = useState();
  console.log(typeof refreshBounty);
  console.log(prize);
  const [selectionState, setSelectionState] = useState(RESTING);
  const height = (100 / numberOfPayouts) * (numberOfPayouts - prize.index);
  const tierIndex = parseInt(prize.index);
  const [appState] = useContext(StoreContext);
  const { account, library } = useWeb3();
  const [user, setUser] = useState({});
  const [closer, setCloser] = useState('');
  const [error, setError] = useState({});
  let unit;
  useEffect(async () => {
    const userId = pr.author.id;
    if (library) {
      const closer = await appState.openQClient.getAddressById(library, userId);

      setCloser(closer);
    }
    setUser({ id: pr.author.id, login: pr.author.login });
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
        if (typeof refreshBounty === 'function') {
          refreshBounty();
        }
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
  const saturation = tierIndex % 2 ? 84 - tierIndex : 84 - tierIndex + 1;
  const lightness = !(tierIndex % 2) ? 48 + tierIndex : 48 + tierIndex - 1;
  const hue = 400 - tierIndex * 67;
  const selectWinner = () => {
    if (prize.claimed) {
      return;
    }
    setSelectionState(CONFIRM);
    setShowModal(true);
  };
  const resetState = () => {
    setSelectionState(CONFIRM);
    setShowModal();
  };
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
        hideToolTip={closer}
        disabled={!closer}
        toolTipText='User has not registered their github with a wallet address, please have them register a wallet address before paying out.'
      >
        <button className={closer ? 'btn-primary' : 'btn-default'} onClick={claimBounty}>
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
        disabled={prize.claimed}
        className={`flex justify-center hover:scale-110 ${
          prize.claimed ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-200'
        } text-black content-center items-center w-full`}
        style={{
          height: `${height}px`,
          transform: `translateY(${100 - height}px)`,
          transformOrigin: 'left center',
          backgroundColor: !prize.claimed ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : '#4f4f4f',
        }}
      >
        <div> {tierIndex + 1}</div>
        <div id='mike' className='fixed inset-0'></div>
      </button>
      {showModal && (
        <ModalDefault
          footerLeft={goBackBtn[selectionState]}
          footerRight={confirmBtn[selectionState]}
          resetState={() => {}}
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
              <p className='my-2'>
                This will automaticaly send {prize.payout}
                {bounty.bountyType === '2' ? '% of funds' : unit} staked on this competition to the author of this
                submission.
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
                {prize.payout}
                {bounty.bountyType === '2' ? '% of funds' : unit} staked on this competition have been sent to{' '}
                {pr.author.name || pr.author.login} at {closer.slice(0, 4)}...{closer.slice(39)} .
              </p>
            </>
          )}
        </ModalDefault>
      )}
    </>
  );
};
export default WinnerSelect;
