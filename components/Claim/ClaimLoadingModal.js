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

  return (
    <>
      <div className='justify-center items-center flex  fixed inset-0 z-50'>
        <div ref={modal} className='w-1/2 lg:w-1/3 min-w-[320px] rounded-sm p-6  w-full bg-nav-bg  text-center'>
          <div className='text-3xl font-semibold pb-8'>{title[claimState]}</div>

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
          {claimState == WITHDRAWAL_INELIGIBLE || claimState == TRANSACTION_CONFIRMED ? (
            <div className='flex items-center justify-end p-5'>
              <button className='btn-default w-full' type='button' onClick={() => updateModal()}>
                Close
              </button>
            </div>
          ) : null}
          {claimState == CONFIRM_CLAIM ? (
            <div className=' p-7 flex flex-col w-full outline-none focus:outline-none'>
              <div className='flex items-center'>
                <button
                  className='btn-primary w-full'
                  type='button'
                  onClick={() => {
                    confirmMethod();
                  }}
                >
                  Yes! Claim!
                </button>
              </div>
            </div>
          ) : null}

          {(claimState === CHECKING_WITHDRAWAL_ELIGIBILITY || claimState === TRANSACTION_SUBMITTED) && (
            <div className='flex justify-center'>
              <LoadingIcon bg='colored' />
            </div>
          )}
        </div>
      </div>
      <div onClick={() => updateModal()} className='bg-overlay z-40 fixed inset-0'></div>
    </>
  );
};

export default ClaimLoadingModal;
