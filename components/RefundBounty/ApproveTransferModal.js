// Third party
import React, { useRef, useEffect } from 'react';

// Custom
import { CONFIRM, APPROVING, TRANSFERRING, SUCCESS, ERROR } from './ApproveTransferState';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import Link from 'next/link';
import LinkText from '../svg/linktext';
import ModalDefault from '../Utils/ModalDefault';

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
}) => {
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
    [SUCCESS]: `Transaction confirmed! Check out your transaction with the link below:\n
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
    <>
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
    </>
  );

  return (
    <ModalDefault
      title={title[approveTransferState]}
      footerRight={btn}
      setShowModal={setShowApproveTransferModal}
      resetState={resetState}
    >
      {/* Body */}
      <div className='text-md  text-center pb-4'>
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
      </div>
    </ModalDefault>
  );
};

export default ApproveTransferModal;
