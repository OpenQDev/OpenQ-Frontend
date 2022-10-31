// Third party
import React, { useRef, useEffect, useContext } from 'react';
import Link from 'next/link';
import StoreContext from '../../store/Store/StoreContext';

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
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

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
  authState,
  price,
  split,
}) => {
  const updateModal = () => {
    setShowClaimLoadingModal(false);
  };
  const modal = useRef();
  const [appState] = useContext(StoreContext);

  let title = {
    [CONFIRM_CLAIM]: 'Claim Rewards',
    [CHECKING_WITHDRAWAL_ELIGIBILITY]: 'Validating Claim...',
    [WITHDRAWAL_INELIGIBLE]: 'Withdrawal Ineligible',
    [TRANSACTION_SUBMITTED]: 'Transaction Submitted',
    [TRANSACTION_CONFIRMED]: 'Rewards Claimed Successfully!',
  };

  let message = {
    [CONFIRM_CLAIM]: `Do you want to claim these rewards?`,
    [CHECKING_WITHDRAWAL_ELIGIBILITY]: 'Checking that you are indeed the droid we are looking for...',
    [WITHDRAWAL_INELIGIBLE]: `You are NOT the droid we are looking for. \nError message: ${error.message}`,
    [TRANSACTION_SUBMITTED]: 'You are indeed the droid we are looking for. See your pending transaction here: ',
    [TRANSACTION_CONFIRMED]: `Transaction confirmed! Funds from this payout will appear in your address at ${address}.`,
  };

  let link = {
    [TRANSACTION_CONFIRMED]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
    [TRANSACTION_SUBMITTED]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
    [CONFIRM_CLAIM]: url,
  };

  const tweetText = `💸 Just claimed a developer bounty from ${bounty.owner} on OpenQ working on this issue: `;
  const latestUserPR = bounty.prs
    ?.filter((pr) => {
      return pr.source.author.login == authState.login;
    })
    .slice(-1)[0];

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
      <div className='gap-2 grid grid-cols-[150px_1fr]'>
        <span>Issue: </span>
        {bounty.url && (
          <Link href={bounty.url}>
            <a target='_blank' rel='noopener noreferrer' className='underline w-full truncate'>
              {bounty.title}
            </a>
          </Link>
        )}
        <span>Your PR:</span>
        {latestUserPR ? (
          <span>
            <Link href={latestUserPR.source.url}>
              <a target='_blank' className={'underline'}>
                {latestUserPR.source.title}
              </a>
            </Link>
            <span>{latestUserPR.source.merged ? ' (merged)' : ' (not merged)'}</span>
          </span>
        ) : (
          <div>No linked PR</div>
        )}
        {(bounty.bountyType == 0 || bounty.bountyType == 1) && (
          <>
            <span>Value:</span>
            <span>{appState.utils.formatter.format(bounty.bountyType == 0 ? price : split)}</span>
          </>
        )}
        <span>To Address:</span>
        <CopyAddressToClipboard data={account || ensName} clipping={[5, 39]} />
        {claimState == TRANSACTION_CONFIRMED && (
          <>
            <span className='pr-8'>Transaction:</span>
            <Link href={link[claimState]}>
              <a target={'_blank'} className='underline' rel='noopener noreferrer'>
                {transactionHash.slice(0, 5)} . . . {transactionHash.slice(62)}
                <LinkText />
              </a>
            </Link>
          </>
        )}
        <div className='col-span-2 whitespace-pre-wrap'>{message[claimState]}</div>
      </div>
    </ModalDefault>
  );
};

export default ClaimLoadingModal;
