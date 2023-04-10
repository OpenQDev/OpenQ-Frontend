// Third party
import React, { useRef, useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';

// Custom
import { CONFIRM, APPROVING, TRANSFERRING, SUCCESS, ERROR } from './ApproveTransferState';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import Image from 'next/image';
import CopyAddressToClipboard from '../CopyAddressToClipboard';
import TokenSearch from '../TokenSelection/TokenSearch';
import StoreContext from '../../store/Store/StoreContext';
import ToolTipNew from '../Utils/ToolTipNew';
import LinkText from '../svg/linktext';
import TokenContext from '../TokenSelection/TokenStore/TokenContext';

const ApproveStreamModal = ({
  resetState,
  transactionHash,
  deleteFlow,
  setShowApproveTransferModal,
  approveTransferState,
  confirmMethod,
  error,
  showModal,
}) => {
  const modal = useRef();
  const [recipient, setRecipient] = useState('');
  const [flowRate, setFlowRate] = useState('');
  const [appState] = useContext(StoreContext);
  const { capitalize, toIng } = appState.utils;
  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;

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

  const isDisabled =
    ((!recipient || !flowRate || !ethers.utils.isAddress(recipient) || isNaN(parseFloat(flowRate))) &&
      showModal !== 'delete') ||
    parseFloat(flowRate) <= 0.00000001 ||
    parseFloat(flowRate) >= 1000;

  let title = {
    [CONFIRM]: `${capitalize(showModal)} Stream`,
    [APPROVING]: 'Approve',
    [TRANSFERRING]: `${capitalize(showModal)} Stream`,
    [SUCCESS]: showModal === 'delete' ? 'Stream deleted' : 'Transaction Complete!',
    [ERROR]: `${error.title}`,
  };
  let approveStyles = {
    [CONFIRM]: `btn-primary ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`,
    [APPROVING]: 'btn-primary hover:bg-[#238636]',
    [TRANSFERRING]: 'border-transparent',
  };

  let fundStyles = {
    [CONFIRM]: 'px-8 border-transparent',
    [APPROVING]: 'px-8 border-transparent hover:cursor-default',
    [TRANSFERRING]: 'btn-primary hover:cursor-default',
  };
  if ('0x0000000000000000000000000000000000000000' === token.address) {
    fundStyles = { ...approveStyles };
  }

  let message = {
    [CONFIRM]: '',
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

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  function handleFlowRateChange(e) {
    appState.utils.updateVolume(e.target.value, setFlowRate);
  }
  return (
    <div>
      <div className='justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 md:pl-20 outline-none focus:outline-none'>
        <div ref={modal} className='w-1/3 min-w-[320px]  max-w-[620px]'>
          <div className='border rounded-sm p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none border-web-gray border'>
            <h3 className='flex items-center border-solid text-primary pb-2 text-xl loose'>
              {title[approveTransferState]}
            </h3>
            {approveTransferState === ERROR ? (
              <div className='text-md pb-4'>
                <p className='break-words'>{message[approveTransferState]}</p>
                {link[approveTransferState] && (
                  <p className='break-all underline'>
                    <Link href={link[approveTransferState]} target={'_blank'} rel='noopener noreferrer'>
                      <>
                        {linkText[approveTransferState] || link[approveTransferState]}
                        <LinkText />
                      </>
                    </Link>
                  </p>
                )}
              </div>
            ) : approveTransferState === SUCCESS ? (
              showModal === 'delete' ? (
                <div className='pb-4'>
                  Stream of {token.symbol} to {recipient.slice(0, 4)}...
                  {recipient.slice(38)} deleted.
                </div>
              ) : (
                <div className='text-md gap-4 py-6 px-4 grid grid-cols-[1fr_1fr] w-full justify-between'>
                  <div className='w-4'>Streaming</div>
                  <div className='flex flex-wrap justify-between w-[120px] gap-2'>
                    <Image
                      width={24}
                      className='inline'
                      height={24}
                      alt='crypto-logo'
                      src={token.path || token.logoURI || '/crypto-logos/ERC20.svg'}
                    />
                    <span> {token.symbol}</span>
                  </div>
                  <span className='pt-2'>To</span>

                  <CopyAddressToClipboard data={recipient} clipping={[5, 38]} />

                  <span>Transaction</span>
                  <Link
                    href={link[approveTransferState]}
                    target={'_blank'}
                    className='underline'
                    rel='noopener noreferrer'
                  >
                    <>
                      {transactionHash.slice(0, 5)}. . .{transactionHash.slice(62)}
                      <LinkText />
                    </>
                  </Link>
                </div>
              )
            ) : (
              <>
                <div className='text-md gap-4 gap-x-12 py-6 grid grid-cols-[1fr_1fr] w-full justify-between'>
                  {showModal !== 'delete' && approveTransferState !== ERROR && (
                    <>
                      <div className='w-4'>Funding</div>

                      <TokenSearch stream={true} />
                      <span className='py-2'>Flow Rate</span>
                      <div className={'flex border border-web-gray rounded-sm py-px pl-2 h-10'}>
                        <input
                          className='bg-transparent py-px outline-none'
                          type='text'
                          name='flowRate'
                          value={flowRate}
                          onChange={handleFlowRateChange}
                          placeholder='flow rate in tokens/day'
                        />
                      </div>
                    </>
                  )}
                  <span className='py-2'>To</span>
                  <div className={'flex stream border border-web-gray rounded-sm '}>
                    <input
                      className='bg-transparent py-px w-5/6 mx-auto outline-none'
                      type='text'
                      name='recipient'
                      value={recipient}
                      onChange={handleRecipientChange}
                      placeholder='recipient address'
                    />
                  </div>
                </div>
                <p className='pb-2'>
                  {(approveTransferState === CONFIRM || approveTransferState === APPROVING) && showModal !== 'delete'
                    ? "First you'll need to let openq access the streaming amount for the first month."
                    : approveTransferState === TRANSFERRING &&
                      showModal !== 'delete' &&
                      `Now you can ${showModal} the stream.`}
                </p>
                {showModal !== 'delete' && approveTransferState !== ERROR ? (
                  <div className='flex w-full justify-evenly px-1.5 gap-2 border-web-gray border rounded-sm py-1.5 self-center'>
                    <button
                      onClick={() => confirmMethod(recipient, flowRate, showModal, token)}
                      disabled={approveTransferState !== CONFIRM || isDisabled}
                      className={`text-center px-1.5 flex  gap-2 py-1.5 ${
                        approveTransferState === CONFIRM && !isDisabled ? 'cursor-pointer ' : ' hover:bg-[#238636]'
                      } ${approveStyles[approveTransferState]}`}
                    >
                      <ToolTipNew
                        hideToolTip={!isDisabled}
                        customOffsets={[-60, 30]}
                        outerStyles={'top-0.5'}
                        relativePosition={'-left-4 w-40 whitespace-normal'}
                        toolTipText={
                          isNaN(parseFloat(flowRate)) ||
                          parseFloat(flowRate) <= 0.00000001 ||
                          parseFloat(flowRate) >= 1000
                            ? 'Please add a flow rate between 0.00000001 and 1000'
                            : 'Please input a valid ethereum address'
                        }
                      >
                        {' '}
                        <div className='flex h-full self-center content-center'>
                          {approveTransferState === CONFIRM
                            ? 'Approve'
                            : approveTransferState === APPROVING
                            ? 'Approving'
                            : 'Approved'}
                        </div>
                      </ToolTipNew>
                      {approveTransferState === APPROVING && <LoadingIcon className={'self-center mt-0.5'} />}
                    </button>
                    <div
                      className={`text-center px-2 flex gap-2 py-1.5 ${fundStyles[approveTransferState]} rounded-sm`}
                    >
                      <span>{capitalize(toIng(showModal, approveTransferState === TRANSFERRING))} Stream</span>
                      {approveTransferState === TRANSFERRING && <LoadingIcon className={'inline mt-0.5'} />}
                    </div>
                  </div>
                ) : (
                  <ToolTipNew
                    hideToolTip={recipient || showModal !== 'delete'}
                    toolTipText='You must identify the recipient of the stream being deleted.'
                    relativePosition={'w-52 whitespace-normal'}
                  >
                    <button
                      onClick={() => deleteFlow(recipient, token)}
                      disabled={approveTransferState !== CONFIRM || !recipient}
                      className={`btn-primary text-center px-2 w-full gap-2 py-1.5 text-center flex justify-center gap-4 rounded-sm ${
                        !recipient && 'hover:bg-[#238636] cursor-not-allowed'
                      }`}
                    >
                      <span>{capitalize(toIng(showModal, approveTransferState === TRANSFERRING))}</span>
                      {approveTransferState === TRANSFERRING && <LoadingIcon className={'inline mt-0.5'} />}
                    </button>
                  </ToolTipNew>
                )}
              </>
            )}

            {approveTransferState == ERROR || approveTransferState == SUCCESS ? (
              <div className='flex items-center justify-center text-lg rounded-b'>
                <button
                  onClick={() => updateModal()}
                  className='text-center btn-default px-6 gap-2 py-1.5 text-center flex justify-center gap-4 cursor-pointer rounded-sm'
                >
                  <span>Close</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className='bg-overlay fixed inset-0'></div>
    </div>
  );
};

export default ApproveStreamModal;
