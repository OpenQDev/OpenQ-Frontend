// Third party
import React, { useRef, useEffect, useContext } from 'react';
import Link from 'next/link';

// Custom
import { CONFIRM, APPROVE, APPROVING, TRANSFERRING, SUCCESS, ERROR } from './ApproveFundState';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import Image from 'next/image';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import StoreContext from '../../store/Store/StoreContext';
import useWeb3 from '../../hooks/useWeb3';
import LinkText from '../svg/linktext';
import TweetAbout from '../Utils/TweetAbout';
import ModalDefault from '../Utils/ModalDefault';

const ApproveFundModal = ({
  transactionHash,
  setShowApproveTransferModal,
  approveTransferState,
  resetState,
  error,
  confirmationMessage,
  confirmMethod,
  token,
  volume,
  bountyAddress,
  bounty,
  allowance,
  depositPeriodDays,
  /*openInvoicingModal*/
}) => {
  const modal = useRef();
  const updateModal = () => {
    resetState();
    setShowApproveTransferModal(false);
  };
  const [appState] = useContext(StoreContext);
  const { account } = useWeb3();
  useEffect(async () => {
    try {
      /*
      const invoicingData = await appState.openQPrismaClient.getInvoicingData(account);
      setInvoicingData(invoicingData);
      */
    } catch (err) {
      appState.logger.error(err, account, bounty.id);
    }
  }, []);
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
    [CONFIRM]: 'Confirm Deposit',
    [APPROVE]: 'Approve Deposit',
    [APPROVING]: 'Approving Deposit...',
    [TRANSFERRING]: 'Transfer',
    [SUCCESS]: 'Transfer Complete!',
    [ERROR]: `${error.title}`,
  };
  let approveStyles = {
    [CONFIRM]: 'btn-primary',
    [APPROVE]: 'btn-primary',
    [APPROVING]: 'btn-primary',
    [TRANSFERRING]: 'btn-default',
  };

  let fundStyles = {
    [CONFIRM]: 'px-8 border-transparent',
    [APPROVING]: 'px-8 border-transparent',
    [TRANSFERRING]: 'btn-primary',
  };
  if ('0x0000000000000000000000000000000000000000' === token.address) {
    fundStyles = { ...approveStyles };
  }

  let message = {
    [CONFIRM]: `${confirmationMessage}`,
    [APPROVE]: 'Please Approve me',
    [APPROVING]: 'Approving...',
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

  const tweetText = `💸 Just funded this issue from ${bounty.owner}/${bounty.repoName} on OpenQ, looking for devs to work on it: `;

  volume = Math.round(volume * Math.pow(10, 10)) / Math.pow(10, 10);

  const fundButton = (
    <div>
      {token.address !== '0x0000000000000000000000000000000000000000' && !allowance ? (
        <div className='flex px-1.5 gap-2 border-gray-700 border rounded-sm py-1.5 self-center'>
          <button
            onClick={confirmMethod}
            disabled={approveTransferState !== CONFIRM}
            className={`flex btn-primary p-2 gap-2 ${approveTransferState === CONFIRM ? 'cursor-pointer' : null} ${
              approveStyles[approveTransferState]
            }`}
          >
            <span>
              {approveTransferState === CONFIRM
                ? 'Approve'
                : approveTransferState === APPROVING
                ? 'Approving'
                : 'Approved'}
            </span>
            {approveTransferState === APPROVING && <LoadingIcon className={'inline pt-1'} />}
          </button>

          <div
            className={`text-center px-2 flex gap-2 py-1.5 border ${
              approveTransferState === TRANSFERRING ? 'cursor-pointer' : null
            } ${fundStyles[approveTransferState]}`}
          >
            <span>{approveTransferState === TRANSFERRING ? 'Funding' : 'Fund'}</span>
            {approveTransferState === TRANSFERRING && <LoadingIcon className={'inline pt-1'} />}
          </div>
        </div>
      ) : (
        <button
          onClick={confirmMethod}
          disabled={approveTransferState !== CONFIRM}
          className={`py-1.5 flex justify-center gap-4 ${approveStyles[approveTransferState]}`}
        >
          <span>{approveTransferState === TRANSFERRING ? 'Funding' : 'Fund'}</span>
          {approveTransferState === TRANSFERRING && <LoadingIcon className={'inline pt-1'} />}
        </button>
      )}
      {approveTransferState == ERROR ? (
        <div className='flex items-center justify-center text-lg rounded-b'>
          <button
            onClick={() => updateModal()}
            className='btn-default py-1.5 text-center flex justify-center cursor-pointer w-full'
          >
            <span>Close</span>
          </button>
        </div>
      ) : (
        approveTransferState == SUCCESS && <TweetAbout tweetText={tweetText} bounty={bounty} />
      )}
      {/*<button onClick={openInvoicingModal} className='btn-primary py-1.5 text-center flex justify-center cursor-pointer w-full'>
    <span>{invoicingData && 'Add'} Invoicing Details</span>
    {approveTransferState === TRANSFERRING && <LoadingIcon className={'inline pt-1'} />}
  </button>*/}
    </div>
  );

  return (
    <ModalDefault
      title={title[approveTransferState]}
      footerRight={fundButton}
      setShowModal={setShowApproveTransferModal}
      resetState={resetState}
    >
      {/* Body */}
      {approveTransferState === 'ERROR' ? (
        <div className='text-md pb-4'>
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
      ) : (
        <>
          <div className='gap-4 grid grid-cols-[100px_1fr]'>
            <div>Deposit:</div>
            <div className='flex gap-2'>
              <Image
                width={20}
                className='inline'
                height={20}
                src={token.path || token.logoURI || '/crypto-logs/ERC20.svg'}
              />
              <span>
                {volume} {token.symbol}
              </span>
            </div>
            <span>Issue: </span>
            {bounty.url && (
              <Link href={bounty.url}>
                <a target='_blank' rel='noopener noreferrer' className='underline w-full truncate'>
                  {bounty.title}
                </a>
              </Link>
            )}
            <span>Locked until:</span>
            <span>{appState.utils.formatUnixDate(parseInt(Date.now() / 1000) + depositPeriodDays * 60 * 60 * 24)}</span>
            <span>To Address:</span>
            <CopyAddressToClipboard data={bountyAddress} clipping={[5, 39]} />
          </div>
        </>
      )}
      <div>{message[approveTransferState]}</div>
      {/* <span>Transaction</span>
            <Link href={link[approveTransferState]}>
              <a target={'_blank'} className='underline' rel='noopener noreferrer'>
                {transactionHash.slice(0, 5)} . . . {transactionHash.slice(62)}
                <LinkText />
              </a>
            </Link> */}
    </ModalDefault>
  );
};

export default ApproveFundModal;
