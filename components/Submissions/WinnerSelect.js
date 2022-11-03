import React, { useContext, useState } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import { RESTING, CONFIRM, TRANSFERRING, SUCCESS, ERROR } from '../FundBounty/ApproveFundState';

import ModalDefault from '../Utils/ModalDefault';

const WinnerSelect = ({ prize, bounty, numberOfPayouts, pr }) => {
  const [showModal, setShowModal] = useState();
  const [selectionState, setSelectionState] = useState(RESTING);
  const height = (100 / numberOfPayouts) * (numberOfPayouts - prize.index);
  const tierIndex = parseInt(prize.index);
  const [appState] = useContext(StoreContext);
  const { account, library } = useWeb3();
  let unit;
  const author = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';

  const claimBounty = async () => {
    try {
      setSelectionState(TRANSFERRING);
      const transaction = await appState.openQClient.claimBounty(
        library,
        bounty.bountyAddress,
        author,
        pr.url,
        tierIndex,
        account
      );
      if (transaction) {
        setSelectionState(SUCCESS);
      }
    } catch (err) {
      appState.logger.error(err, account, bounty.id);
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
      <button className='btn-primary' onClick={claimBounty}>
        Confirm
      </button>
    ),
    TRANSFERRING: (
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
  };
  return (
    <>
      <div
        data-testid='winnerSelect'
        onClick={selectWinner}
        className='flex justify-center cursor-pointer text-black content-center items-center w-full'
        style={{
          height: `${height}px`,
          transform: `translateY(${100 - height}px)`,
          transformOrigin: 'left center',
          backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        }}
      >
        <div> {tierIndex + 1}</div>
        <div id='mike' className='fixed inset-0'></div>
      </div>
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
          {selectionState === SUCCESS && (
            <>
              <p className='my-2'>
                {prize.payout}
                {bounty.bountyType === '2' ? '% of funds' : unit} staked on this competition have been sent to{' '}
                {pr.author.name || pr.author.login} at {author.slice(0, 4)}...{author.slice(0, 4)} .
              </p>
            </>
          )}
        </ModalDefault>
      )}
    </>
  );
};
export default WinnerSelect;
