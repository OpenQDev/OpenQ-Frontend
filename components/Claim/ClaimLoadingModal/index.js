// Third party
import React, { useRef, useEffect, useContext } from 'react';
import Link from 'next/link';
import StoreContext from '../../../store/Store/StoreContext';

// Custom
import {
  CHECKING_WITHDRAWAL_ELIGIBILITY,
  WITHDRAWAL_INELIGIBLE,
  TRANSACTION_SUBMITTED,
  TRANSACTION_CONFIRMED,
  CONFIRM_CLAIM,
} from '../ClaimStates';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import LinkText from '../../svg/linktext';
import TweetAbout from '../../Utils/TweetAbout';
import ModalDefault from '../../Utils/ModalDefault';
import CopyAddressToClipboard from '../../CopyAddressToClipboard';
import { ethers } from 'ethers';

const ClaimLoadingModal = ({
  confirmMethod,
  url,
  account,
  transactionHash,
  setShowClaimLoadingModal,
  claimValueTier,
  error,
  claimState,
  bounty,
  authState,
  price,
  split,
}) => {
  /* const referencedPrs = [
    { url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/225' },
    { url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/227' },
  ]; */
  const updateModal = () => {
    setShowClaimLoadingModal(false);
  };

  const modal = useRef();
  const [appState] = useContext(StoreContext);
  const payoutToken = appState.tokenClient.getToken(claimValueTier?.tokenAddress);
  const valueText =
    bounty.bountyType === 0
      ? appState.utils.formatter.format(price)
      : `${ethers.utils.formatUnits(claimValueTier.volume, payoutToken.decimals)} ${payoutToken.name}`;
  const valueClaimed = appState.utils.formatter.format(bounty.bountyType == 0 ? price : split);
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
    [TRANSACTION_CONFIRMED]: `Transaction confirmed! Funds from this payout will appear in your address soon.`,
  };

  let link = {
    [TRANSACTION_CONFIRMED]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
    [TRANSACTION_SUBMITTED]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
    [CONFIRM_CLAIM]: url,
  };

  const tweetText = `💸 Just claimed a developer bounty from ${bounty.owner} for ${valueText} on OpenQ connected to this issue: `;
  const latestUserPR = bounty.prs
    ?.filter((pr) => {
      return pr.source.author.login == authState.login;
    })
    .slice(-1)[0];

  // Hooks

  useEffect(() => {
    let cancelled = false;
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal.current.contains(event.target) && !cancelled) {
        updateModal();
      }
    }

    // Bind the event listener
    if (claimState !== TRANSACTION_SUBMITTED && claimState !== CHECKING_WITHDRAWAL_ELIGIBILITY) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      cancelled = true;

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
          className='btn-primary bg-green'
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
          <Link href={bounty.url} target='_blank' rel='noopener noreferrer' className='underline w-full truncate'>
            <span> {bounty.title}</span>
          </Link>
        )}
        <span>Your PR:</span>
        {latestUserPR ? (
          <span>
            <Link href={latestUserPR.source.url} target='_blank' className={'underline'}>
              <span> {latestUserPR.source.title}</span>
            </Link>
            <span>{latestUserPR.source.merged ? ' (merged)' : ' (not merged)'}</span>
          </span>
        ) : (
          <div>No linked PR</div>
        )}
        {(bounty.bountyType == 0 || bounty.bountyType == 1) && (
          <>
            <span>Value:</span>
            <span>{valueClaimed}</span>
          </>
        )}
        <span>To Address:</span>
        <CopyAddressToClipboard data={account} clipping={[5, 39]} />
        {claimState == TRANSACTION_CONFIRMED && (
          <>
            <span className='pr-8'>Transaction:</span>
            <Link href={link[claimState]} target={'_blank'} className='underline' rel='noopener noreferrer'>
              <>
                {transactionHash.slice(0, 5)}. . .{transactionHash.slice(62)}
                <LinkText />
              </>
            </Link>
          </>
        )}

        <div className='col-span-2 whitespace-pre-wrap'>{message[claimState]}</div>
        {claimState == TRANSACTION_SUBMITTED && (
          <>
            <Link href={link[claimState]} target={'_blank'} className='underline col-span-2' rel='noopener noreferrer'>
              <>
                {link[claimState]}
                <LinkText />
              </>
            </Link>
          </>
        )}
        {error?.referencedPrs &&
          claimState == WITHDRAWAL_INELIGIBLE &&
          error.referencedPrs.map((pr, index) => {
            return (
              <Link key={index} href={pr.url} className='text-link-colour hover:underline col-span-2' target='_blank'>
                {pr.url}
              </Link>
            );
          })}
      </div>
    </ModalDefault>
  );
};

export default ClaimLoadingModal;
