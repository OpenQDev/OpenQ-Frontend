// Third party
import React, { useRef, useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';

// Custom
import { CONFIRM, APPROVING, TRANSFERRING, SUCCESS, ERROR } from './ApproveTransferState';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import Image from 'next/image';
import TokenSearch from '../TokenSelection/TokenSearch';
import ToolTipNew from '../Utils/ToolTipNew';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LinkText from '../svg/linktext';
import TokenProvider from '../TokenSelection/TokenStore/TokenProvider';

const FundStreamModal = ({
  transactionHash,
  setShowApproveTransferModal,
  approveTransferState,
  resetState,
  error,
  confirmationMessage,
  fund,
  approvingMessage,
  showModal,
}) => {
  const modal = useRef();
  const [volume, setVolume] = useState('');
  const { account } = useWeb3();
  const [localToken, setLocalToken] = useState({
    name: 'Dai',
    address: '0xB221D2E203F9e71E3a5cE0a745A6A9e890d8ED50',
    symbol: 'DAI',
    decimals: 18,
    chainId: 80001,
    path: '/crypto-logos/DAI.svg',
  });
  const [appState] = useContext(StoreContext);
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
    ((!volume || isNaN(volume)) && showModal !== 'delete') ||
    isNaN(parseFloat(volume)) ||
    parseFloat(volume) <= 0.00000001 ||
    parseFloat(volume) >= 1000;

  let title = {
    [CONFIRM]: 'Fund Stream',
    [APPROVING]: 'Approve',
    [SUCCESS]: 'Stream Funded',
    [ERROR]: `${error.title}`,
  };
  let approveStyles = {
    [CONFIRM]: `btn-primary ${isDisabled ? 'cursor-not-allowed' : ''} `,
    [APPROVING]: 'btn-primary',
  };

  let message = {
    [CONFIRM]: `${confirmationMessage}`,
    [APPROVING]: approvingMessage || 'Approving...',
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

  function onCurrencySelect(token) {
    setLocalToken({
      ...token,
      address: ethers.utils.getAddress(token.address),
    });
  }

  function handleVolumeChange(e) {
    appState.utils.updateVolume(e.target.value, setVolume);
  }

  return (
    <div>
      <div className='justify-center items-center font-mont flex overflow-x-hidden overflow-y-auto min-w-[320px]  fixed inset-0 z-50 md:pl-20 outline-none focus:outline-none'>
        <div
          ref={modal}
          className=' rounded-sm p-7 max-w-[620px] w-1/3 min-w-[320px] shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none border-web-gray border'
        >
          <div className='flex items-center '>
            <div className='flex flex-row'>
              <h3 className='flex items-center border-solid text-primary pb-2 text-xl loose'>
                {title[approveTransferState]}
              </h3>
            </div>
          </div>

          <>
            <p>
              {(approveTransferState === CONFIRM || approveTransferState === APPROVING) &&
                `You don't need to top up streams for each stream. Adding funds from this account will keep all your streams from the account ${account.slice(
                  0,
                  4
                )}...${account.slice(38)} solvent.`}
            </p>
          </>
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
            <div className='text-md gap-4 py-6 px-4 grid grid-cols-[1fr_1fr] w-full justify-between'>
              <div className='w-4'>Funding</div>
              <div className='flex flex-wrap justify-between w-[120px] gap-2'>
                <Image
                  width={24}
                  className='inline'
                  height={24}
                  alt='crypto-logo'
                  src={localToken.path || localToken.logoURI || '/crypto-logos/ERC20.svg'}
                />
                <span> {localToken.symbol}</span>
              </div>

              <span>Transaction</span>
              <Link href={link[approveTransferState]} target={'_blank'} className='underline' rel='noopener noreferrer'>
                <>
                  {transactionHash.slice(0, 5)}. . .{transactionHash.slice(62)}
                  <LinkText />
                </>
              </Link>
            </div>
          ) : (
            <>
              <div className='text-md gap-4 gap-x-12 py-6 grid grid-cols-[1fr_1fr] w-full justify-between'>
                <div className='w-4'>Token</div>
                <TokenProvider>
                  <TokenSearch stream={true} token={localToken} onCurrencySelect={onCurrencySelect} />
                </TokenProvider>
                <span className='py-2'>Amount</span>
                <div className={'flex border border-web-gray rounded-sm py-px pl-2 h-10'}>
                  <input
                    className='bg-transparent py-px outline-none'
                    type='text'
                    name='volume'
                    value={volume}
                    onChange={handleVolumeChange}
                    placeholder={0.0}
                  />
                </div>
              </div>
              <>
                <div className='flex w-full justify-evenly px-1.5 gap-2 rounded-sm py-1.5 self-center'>
                  {showModal !== 'delete' && approveTransferState !== ERROR && (
                    <button
                      onClick={() => fund(volume, localToken)}
                      disabled={approveTransferState !== CONFIRM || isDisabled}
                      className={`text-center px-2 flex  gap-2 py-1.5 ${
                        approveTransferState === CONFIRM && !isDisabled ? 'cursor-pointer' : null
                      } ${approveStyles[approveTransferState]} rounded-sm`}
                    >
                      <ToolTipNew
                        hideToolTip={!isDisabled}
                        customOffsets={[-60, 30]}
                        toolTipText='Please add an amount between 0.00000001 and 1000'
                      >
                        {' '}
                        <span>
                          {approveTransferState === CONFIRM
                            ? 'Approve'
                            : approveTransferState === APPROVING
                            ? 'Approving'
                            : 'Approved'}
                        </span>
                      </ToolTipNew>
                      {approveTransferState === APPROVING && <LoadingIcon className={'inline pt-1'} />}
                    </button>
                  )}
                </div>
              </>
            </>
          )}

          {approveTransferState == ERROR || approveTransferState == SUCCESS ? (
            <div className='flex items-center justify-center text-lg rounded-b'>
              <button
                onClick={() => updateModal()}
                className='text-center btn-primary px-6 gap-2 py-1.5 text-center flex justify-center gap-4 cursor-pointer rounded-sm'
              >
                <span>Close</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className='bg-overlay fixed inset-0'></div>
    </div>
  );
};

export default FundStreamModal;
