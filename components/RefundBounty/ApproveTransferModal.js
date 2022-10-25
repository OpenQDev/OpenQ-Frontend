// Third party
import React, { useRef, useEffect, useContext } from 'react';

// Custom
import { CONFIRM, APPROVING, TRANSFERRING, SUCCESS, ERROR } from './ApproveTransferState';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import Link from 'next/link';
import LinkText from '../svg/linktext';
import ModalDefault from '../Utils/ModalDefault';
import Image from 'next/image';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';

const ApproveTransferModal = ({
  approveTransferState,
  transactionHash,
  setShowApproveTransferModal,
  resetState,
  error,
  confirmationMessage,
  positiveOption,
  confirmMethod,
  approvingMessage,
  approvingTitle,
  bounty,
  depositPeriodDays,
  depositId,
  account,
}) => {
  const [appState] = useContext(StoreContext);
  const deposit = bounty.deposits.filter((deposit) => deposit.id == depositId)[0];
  const tokenMetadata = appState.tokenClient.getToken(deposit.tokenAddress);
  let bigNumberVolume = ethers.BigNumber.from(deposit.volume.toString());
  let decimals = parseInt(tokenMetadata.decimals) || 18;
  let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);

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
    if (approveTransferState !== APPROVING && approveTransferState !== TRANSFERRING) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal, approveTransferState]);

  let title = {
    [CONFIRM]: 'Confirm',
    [APPROVING]: approvingTitle || 'Approve',
    [TRANSFERRING]: 'Transfer',
    [SUCCESS]: 'Transfer Complete!',
    [ERROR]: `${error.title}`,
  };

  let message = {
    [CONFIRM]: `${confirmationMessage}`,
    [APPROVING]: approvingMessage || 'Approving...',
    [TRANSFERRING]: 'Transferring...',
    [SUCCESS]: `Transaction confirmed!\n
		`,
    [ERROR]: `${error.message}`,
  };

  let link = {
    [SUCCESS]: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
    [ERROR]: error.link,
  };

  let linkText = {
    [ERROR]: `${error.linkText}`,
  };

  {
    /* Button */
  }
  const btn = (
    <div>
      {approveTransferState == 'CONFIRM' ? (
        <button
          className='btn-primary'
          type='button'
          onClick={() => {
            confirmMethod();
          }}
        >
          {positiveOption}
        </button>
      ) : null}
      {approveTransferState == ERROR || approveTransferState == SUCCESS ? (
        <button className='btn-default w-full' type='button' onClick={() => updateModal()}>
          Close
        </button>
      ) : null}
      {(approveTransferState === TRANSFERRING || approveTransferState === APPROVING) && (
        <div className='self-center'>
          <LoadingIcon bg='colored' />
        </div>
      )}
    </div>
  );

  return (
    <ModalDefault
      title={title[approveTransferState]}
      footerRight={btn}
      setShowModal={setShowApproveTransferModal}
      resetState={resetState}
    >
      {/* Body */}
      <>
        <div className='gap-4 grid grid-cols-[100px_1fr]'>
          <div>Deposit:</div>
          <div className='flex gap-2'>
            <Image
              width={20}
              className='inline'
              height={20}
              src={tokenMetadata.path || tokenMetadata.logoURI || '/crypto-logs/ERC20.svg'}
            />
            <span>
              {formattedVolume} {tokenMetadata.symbol}
            </span>
          </div>
          {positiveOption == 'Yes, Extend!' && (
            <>
              <span>Extend by:</span>
              <span>
                {depositPeriodDays[deposit.id]} {depositPeriodDays[depositId] == 1 ? 'day' : 'days'}
              </span>
              <span>Locked until:</span>
              <span>
                {appState.utils.formatUnixDate(
                  parseInt(Date.now() / 1000) + depositPeriodDays[depositId] * 60 * 60 * 24
                )}
              </span>
            </>
          )}
          <span>
            {positiveOption == 'Yes, Extend!' ? 'On' : 'From'} {'address:'}
          </span>
          <CopyAddressToClipboard data={bounty.bountyAddress} clipping={[5, 39]} />
          {positiveOption != 'Yes, Extend!' && (
            <>
              <span>To address:</span>
              <CopyAddressToClipboard data={account} clipping={[5, 39]} />
            </>
          )}
          {approveTransferState == SUCCESS && (
            <>
              <span className='pr-8'>Transaction:</span>
              <Link href={link[approveTransferState]}>
                <a target={'_blank'} className='underline' rel='noopener noreferrer'>
                  {transactionHash.slice(0, 5)} . . . {transactionHash.slice(62)}
                  <LinkText />
                </a>
              </Link>
            </>
          )}
          <div className='col-span-2'>{message[approveTransferState]}</div>
        </div>
      </>
      {/* <div className='text-md  text-center pb-4'>
        <p className='break-words'>{message[approveTransferState]}</p>
        {link[approveTransferState] && (
          <p className='break-all underline'>
            <Link href={link[approveTransferState]}>
              <a target={'_blank'} rel='noopener noreferrer'>
                {linkText[approveTransferState] || link[approveTransferState]}
                <LinkText />
              </a>
            </Link>
          </p>
        )}
      </div> */}
    </ModalDefault>
  );
};

export default ApproveTransferModal;
