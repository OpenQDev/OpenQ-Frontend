// Third party
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

// Custom
import {
  CHECKING_WITHDRAWAL_ELIGIBILITY,
  WITHDRAWAL_INELIGIBLE,
  TRANSACTION_SUBMITTED,
  TRANSACTION_CONFIRMED,
  CONFIRM_CLAIM,
} from './ClaimStates';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import LinkText from '../svg/linktext';
import TweetAbout from '../Utils/TweetAbout';
import ModalDefault from '../Utils/ModalDefault';

const ClaimLoadingModal = ({
  confirmMethod,
  url,
  ensName,
  account,
  address,
  transactionHash,
  setShowClaimLoadingModal,
  error,
  claimState,
  bounty,
}) => {
  const updateModal = () => {
    setShowClaimLoadingModal(false);
  };
  const modal = useRef();

  let title = {
    [CONFIRM_CLAIM]: 'Confirm Claim',
    [CHECKING_WITHDRAWAL_ELIGIBILITY]: 'Validating Claim',
    [WITHDRAWAL_INELIGIBLE]: 'Withdrawal Ineligible',
    [TRANSACTION_SUBMITTED]: 'Transaction Submitted',
    [TRANSACTION_CONFIRMED]: 'Transaction Confirmed!',
  };

  let message = {
    [CONFIRM_CLAIM]: `You are about to claim the deposits on issue`,
    [CHECKING_WITHDRAWAL_ELIGIBILITY]: 'Checking that you are indeed the droid we are looking for...',
    [WITHDRAWAL_INELIGIBLE]: `You are NOT the droid we are looking for. Error message: ${error.message}`,
    [TRANSACTION_SUBMITTED]: 'You are indeed the droid we are looking for. See your pending transaction here: ',
    [TRANSACTION_CONFIRMED]: 'Transaction confirmed!  Check out your transaction with the link below: ',
  };

  let link = {
    [TRANSACTION_CONFIRMED]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
    [TRANSACTION_SUBMITTED]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
    [CONFIRM_CLAIM]: url,
  };

  let afterLink = {
    [TRANSACTION_CONFIRMED]: ` Funds from this payout will appear in your address at ${address}.`,
    [TRANSACTION_SUBMITTED]: '',
    [CONFIRM_CLAIM]: ` to the address ${ensName || account}. Is this correct?`,
  };

  const tweetText = `💸 Just claimed a developer bounty from ${bounty.owner} on OpenQ working on this issue: `;

  // Hooks

  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal.current.contains(event.target)) {
        updateModal();
      }
    }

    // Bind the event listener
    if (claimState !== TRANSACTION_SUBMITTED && claimState !== CHECKING_WITHDRAWAL_ELIGIBILITY) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal, claimState]);

  const btn = (
    <div>
      {claimState == WITHDRAWAL_INELIGIBLE && (
        <button className='btn-default' type='button' onClick={() => updateModal()}>
          Close
        </button>
      )}
      {claimState == TRANSACTION_CONFIRMED && <TweetAbout tweetText={tweetText} bounty={bounty} />}
      {claimState == CONFIRM_CLAIM ? (
        <button
          className='btn-primary'
          type='button'
          onClick={() => {
            confirmMethod();
          }}
        >
          Yes! Claim!
        </button>
      ) : null}

      {(claimState === CHECKING_WITHDRAWAL_ELIGIBILITY || claimState === TRANSACTION_SUBMITTED) && (
        <button className='flex items-center gap-2 btn-default cursor-not-allowed' type='button' disabled={true}>
          Claiming...
          <LoadingIcon bg='colored' />
        </button>
      )}
    </div>
  );

  return (
    <ModalDefault
      title={title[claimState]}
      footerRight={btn}
      setShowModal={setShowClaimLoadingModal}
      resetState={updateModal}
    >
      <div className='text-md  pb-2 break-words'>
        <span>{message[claimState]}</span>
        {link[claimState] && (
          <div>
            <>
              <Link href={link[claimState]}>
                <a className='underline break-all' target='_blank' rel='noopener noreferrer'>
                  {link[claimState]}
                  <LinkText />
                </a>
              </Link>
            </>
            <span>{afterLink[claimState]}</span>
          </div>
        )}
      </div>
    </ModalDefault>
  );
};

export default ClaimLoadingModal;
