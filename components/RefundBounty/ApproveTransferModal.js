// Third party
import React, { useRef, useEffect, useContext, useState } from 'react';

// Custom
import { CONFIRM, APPROVING, SUCCESS, ERROR } from './ApproveTransferState';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import Link from 'next/link';
import LinkText from '../svg/linktext';
import ModalDefault from '../Utils/ModalDefault';
import Image from "next/legacy/image";
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';
import TweetAbout from '../Utils/TweetAbout';
import useEns from '../../hooks/useENS';

const ApproveTransferModal = ({
  approveTransferState,
  transactionHash,
  setShowApproveTransferModal,
  resetState,
  error,
  extend,
  confirmMethod,
  bounty,
  depositPeriodDays,
  depositId,
  account,
  depositExpired,
}) => {
  const [appState] = useContext(StoreContext);
  const [ensName] = useEns(account);
  const deposit = bounty.deposits.filter((deposit) => deposit.id == depositId)[0];
  const tokenMetadata = appState.tokenClient.getToken(deposit.tokenAddress);
  let bigNumberVolume = ethers.BigNumber.from(deposit.volume.toString());
  let decimals = parseInt(tokenMetadata.decimals) || 18;
  let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
  const [lockDate] = useState(
    appState.utils.formatUnixDate(
      depositExpired(deposit)
        ? parseInt(Date.now() / 1000) + depositPeriodDays[depositId] * 60 * 60 * 24
        : parseInt(deposit.receiveTime) +
            parseInt(deposit.expiration) +
            parseInt(depositPeriodDays[depositId] * 60 * 60 * 24)
    )
  );
  const tweetText = `💸 Just extended the deposit period for this issue from ${bounty.owner}/${bounty.repoName} on OpenQ, looking for devs to work on it: `;

  const modal = useRef();
  const updateModal = () => {
    resetState();
    setShowApproveTransferModal(false);
  };
  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal.current.contains(event.target)) {
        updateModal();
      }
    }

    // Bind the event listener
    if (approveTransferState !== APPROVING) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal, approveTransferState]);

  let action = extend ? 0 : 1;

  let statesFormat = {
    [CONFIRM]: {
      title: ['Extend Lock Period', 'Refund Deposit'],
      message: [
        'Are you sure you want to extend this deposit?',
        'Are you sure you want to refund this deposit? The refund may only be partial if contributors have claimed funds on this contract already.',
      ],
      btnText: ['Yes, extend!', 'Yes, refund!'],
      btnStyle: ['btn-primary'],
      clickMethod: confirmMethod,
    },
    [APPROVING]: {
      title: ['Extending Lock Period...', 'Refunding Deposit...'],
      message: ['Extending your deposit...', 'Refunding your deposit...'],
      btnText: ['Extending...', 'Refunding...'],
      btnStyle: ['btn-default cursor-not-allowed'],
    },
    [SUCCESS]: {
      title: ['Lock Period Extended!', 'Deposit Refunded!'],
      message: [
        'You have successfully extended your deposit!',
        'The refund may only be partial if contributors have claimed funds on this contract already.',
      ],
      btnText: ['', 'Close'],
      btnStyle: ['btn-default'],
      clickMethod: updateModal,
      link: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
      linkText: 'Transaction: ',
    },
    [ERROR]: {
      title: [`${error.title}`, `${error.title}`],
      message: [`${error.message}`, `${error.message}`],
      btnText: ['Close', 'Close'],
      btnStyle: ['btn-default'],
      clickMethod: updateModal,
      link: error.link,
      linkText: `${error.linkText}`,
    },
  };

  {
    /* Button */
  }
  const btn = (
    <div>
      {extend && approveTransferState == SUCCESS ? (
        <TweetAbout tweetText={tweetText} bounty={bounty} />
      ) : (
        <button
          className={`flex items-center gap-2 ${statesFormat[approveTransferState].btnStyle}`}
          onClick={statesFormat[approveTransferState].clickMethod}
        >
          {statesFormat[approveTransferState].btnText[action]}
          {approveTransferState === APPROVING && <LoadingIcon bg='colored' />}
        </button>
      )}
    </div>
  );

  return (
    <ModalDefault
      title={statesFormat[approveTransferState].title[action]}
      footerRight={btn}
      setShowModal={setShowApproveTransferModal}
      resetState={resetState}
    >
      {/* Body */}
      <>
        <div className='gap-4 grid grid-cols-[150px_1fr]'>
          <div>Deposit:</div>
          <div className='flex gap-2'>
            <Image
              width={20}
              className='inline'
              height={20}
              src={tokenMetadata.path || tokenMetadata.logoURI || '/crypto-logos/ERC20.svg'}
            />
            <span>
              {formattedVolume} {tokenMetadata.symbol}
            </span>
          </div>
          {extend && (
            <>
              <span>Extend by:</span>
              <span>
                {depositPeriodDays[depositId]} {depositPeriodDays[depositId] == 1 ? 'day' : 'days'}
              </span>
              <span>Locked until:</span>
              <span>{lockDate}</span>
            </>
          )}
          <span>
            {extend ? 'On' : 'From'} {'address:'}
          </span>
          <CopyAddressToClipboard data={bounty.bountyAddress} clipping={[5, 39]} />
          {!extend && (
            <>
              <span>To address:</span>
              <CopyAddressToClipboard data={account || ensName} clipping={[5, 39]} />
            </>
          )}
          {statesFormat[approveTransferState].link && (
            <>
              <span className='pr-8'>{statesFormat[approveTransferState].linkText}</span>
              <Link href={statesFormat[approveTransferState].link}>
                <a target={'_blank'} className='underline' rel='noopener noreferrer'>
                  {transactionHash.slice(0, 5)} . . . {transactionHash.slice(62)}
                  <LinkText />
                </a>
              </Link>
            </>
          )}
          <div className='col-span-2'>{statesFormat[approveTransferState].message[action]}</div>
        </div>
      </>
    </ModalDefault>
  );
};

export default ApproveTransferModal;
