// Third party
import React, { useRef, useEffect, useContext } from 'react';
import Link from 'next/link';

// Custom
import { CONFIRM, APPROVING, TRANSFERRING, SUCCESS, ERROR } from './ApproveFundState';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import Image from 'next/image';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import StoreContext from '../../store/Store/StoreContext';
import useWeb3 from '../../hooks/useWeb3';

const ApproveFundModal = ({
  transactionHash,
  setShowApproveTransferModal,
  approveTransferState,
  resetState,
  error,
  confirmationMessage,
  confirmMethod,
  approvingMessage,
  approvingTitle,
  token,
  volume,
  bountyAddress,
  bounty,
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
    [APPROVING]: approvingTitle || 'Approve',
    [TRANSFERRING]: 'Transfer',
    [SUCCESS]: 'Transfer Complete!',
    [ERROR]: `${error.title}`,
  };
  let approveStyles = {
    [CONFIRM]: 'btn-primary',
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

  volume = Math.round(volume * Math.pow(10, 10)) / Math.pow(10, 10);

  return (
    <div>
      <div className='justify-center items-center flex overflow-x-hidden text-primary overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div ref={modal} className='min-w-[320px] max-w-[620px] mx-8 px-4'>
          <div className='rounded-sm p-6 shadow-lg flex flex-col w-full bg-[#161B22] outline-none focus:outline-none'>
            <div className='flex items-center justify-center border-solid'>
              <div className='flex flex-row'>
                <div className='text-2xl font-semibold'>{title[approveTransferState]}</div>
              </div>
            </div>
            {approveTransferState === 'ERROR' ? (
              <div className='text-md pb-4'>
                <p className='break-words'>{message[approveTransferState]}</p>
                {link[approveTransferState] && (
                  <p className='break-all underline'>
                    <Link href={link[approveTransferState]}>
                      <a target={'_blank'} rel='noopener noreferrer'>
                        {linkText[approveTransferState] || link[approveTransferState]}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4 inline'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          strokeWidth='2'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
                        </svg>
                      </a>
                    </Link>
                  </p>
                )}
              </div>
            ) : approveTransferState === SUCCESS ? (
              <>
                <div className='text-md gap-4 py-6 px-4 grid grid-cols-[1fr_1fr] w-full justify-between'>
                  <div className='w-4'>Deposited</div>
                  <div className='flex flex-wrap justify-between w-[120px] gap-2'>
                    <Image
                      width={24}
                      className='inline'
                      height={24}
                      src={token.path || token.logoURI || '/crypto-logs/ERC20.svg'}
                    />
                    <span>
                      {volume} {token.symbol}
                    </span>
                  </div>
                  <span>To</span>
                  <CopyAddressToClipboard data={bountyAddress} clipping={[5, 39]} />
                  <span>For</span>
                  {bounty.url && (
                    <Link href={bounty.url}>
                      <a target='_blank' rel='noopener noreferrer' className='underline'>
                        {bounty.title}
                      </a>
                    </Link>
                  )}
                  <span>Transaction</span>
                  <Link href={link[approveTransferState]}>
                    <a target={'_blank'} className='underline' rel='noopener noreferrer'>
                      {transactionHash.slice(0, 5)} . . . {transactionHash.slice(62)}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 inline'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                        />
                      </svg>
                    </a>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className='text-md gap-4 py-6 pb-[68px] px-4 grid grid-cols-[1fr_1fr] w-full justify-between'>
                  <div className='w-4'>Funding</div>
                  <div className='flex flex-wrap justify-between w-[120px] gap-2'>
                    <Image
                      width={24}
                      className='inline'
                      height={24}
                      src={token.path || token.logoURI || '/crypto-logos/ERC20.svg'}
                    />
                    <span>
                      {volume} {token.symbol}
                    </span>
                  </div>
                  <span>To</span>
                  <CopyAddressToClipboard data={bountyAddress} clipping={[5, 39]} />
                  <span>For</span>
                  {bounty.url && (
                    <Link href={bounty.url}>
                      <a target='_blank' rel='noopener noreferrer' className='underline'>
                        {bounty.title}
                      </a>
                    </Link>
                  )}
                  {/* <div className='col-span-2 text-center'>{message[approveTransferState]}</div> */}
                </div>
                {token.address !== '0x0000000000000000000000000000000000000000' ? (
                  <div className='flex px-1.5 gap-2 border-gray-700 border rounded-sm py-1.5 self-center'>
                    <button
                      onClick={confirmMethod}
                      disabled={approveTransferState !== CONFIRM}
                      className={`flex btn-primary p-2 gap-2 ${
                        approveTransferState === CONFIRM ? 'cursor-pointer' : null
                      } ${approveStyles[approveTransferState]}`}
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
                    className={`py-1.5 flex justify-center gap-4 ${fundStyles[approveTransferState]}`}
                  >
                    <span>{approveTransferState === TRANSFERRING ? 'Funding' : 'Fund'}</span>
                    {approveTransferState === TRANSFERRING && <LoadingIcon className={'inline pt-1'} />}
                  </button>
                )}
              </>
            )}
            {approveTransferState == ERROR ? (
              <div className='flex items-center justify-center text-lg rounded-b'>
                <button
                  onClick={() => updateModal()}
                  className='btn-default py-1.5 text-center flex justify-center cursor-pointer w-full'
                >
                  <span>Close</span>
                  {approveTransferState === TRANSFERRING && <LoadingIcon className={'inline pt-1'} />}
                </button>
              </div>
            ) : (
              approveTransferState == SUCCESS && (
                <div className='flex items-center justify-between gap-8 text-lg rounded-b'>
                  <button
                    onClick={() => updateModal()}
                    className='btn-default py-1.5 text-center flex justify-center cursor-pointer w-full'
                  >
                    <span>Close</span>
                    {approveTransferState === TRANSFERRING && <LoadingIcon className={'inline pt-1'} />}
                  </button>
                  {/*<button onClick={openInvoicingModal} className='btn-primary py-1.5 text-center flex justify-center cursor-pointer w-full'>
								<span>{invoicingData && 'Add'} Invoicing Details</span>
								{approveTransferState === TRANSFERRING && <LoadingIcon className={'inline pt-1'} />}
							</button>*/}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div className='bg-overlay z-10 fixed inset-0'></div>
    </div>
  );
};

export default ApproveFundModal;
