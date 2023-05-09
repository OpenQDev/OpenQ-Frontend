// Third party
import React, { useRef, useEffect, useContext, useState } from 'react';
import Link from 'next/link';

// Custom
import { CONFIRM, APPROVE, APPROVING, TRANSFERRING, SUCCESS, ERROR, RESTING } from '../FundStore/ApproveFundState';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import TokenStats from '../../TokenSelection/TokenStats';
import CopyAddressToClipboard from '../../CopyAddressToClipboard';
import StoreContext from '../../../store/Store/StoreContext';
import LinkText from '../../svg/linktext';
import TweetAbout from '../../Utils/TweetAbout';
import ModalDefault from '../../Utils/ModalDefault';
import FundContext from '../FundStore/FundContext';
import GnosisWarning from '../../Utils/GnosisWarning';

// setError,
// setApproveTransferState,
//  setButtonText,
//   setShowApproveTransferModal,
// setTransactionHash,
// setSuccessMessage,
//   refreshBounty,
const ApproveFundModal = ({
  confirmMethod,

  /*openInvoicingModal*/
}) => {
  const modal = useRef();
  const [fundState, fundDispatch] = useContext(FundContext);
  const {
    volume,
    token,
    transactionHash,
    bounty,
    pickedNft,
    refreshBounty,
    allowance,
    depositPeriodDays,
    error,
    approveTransferState,
  } = fundState;
  const [accepted, setAccepted] = useState(false);
  const handleAccept = (e) => {
    setAccepted(e.target.checked);
  };
  const closeModal = () => {
    const dispatch = {
      type: 'SET_NFT',
    };
    const approveTransferDispatch = {
      type: 'SET_APPROVE_TRANSFER_STATE',
      payload: RESTING,
    };
    fundDispatch(approveTransferDispatch);
    fundDispatch(dispatch);
  };
  const updateModal = () => {
    refreshBounty();
    closeModal();
  };
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  useEffect(() => {
    try {
      /*
      const invoicingData = await appState.openQPrismaClient.getInvoicingData(account);
      setInvoicingData(invoicingData);
      */
    } catch (err) {
      appState.logger.error(err, accountData.id, bounty.id + 'ApproveFundModal.js1');
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

  useEffect(() => {
    // REFACTOR: is there a better way to force the correct state here?
    if (allowance) {
      const dispatch = {
        type: 'SET_APPROVE_TRANSFER_STATE',
        payload: CONFIRM,
      };
      fundDispatch(dispatch);
    }
    if (
      token.address !== '0x0000000000000000000000000000000000000000' &&
      !allowance &&
      approveTransferState == CONFIRM
    ) {
      const dispatch = {
        type: 'SET_APPROVE_TRANSFER_STATE',
        payload: APPROVE,
      };
      fundDispatch(dispatch);
    }
  }, [allowance]);

  let statesFormat = {
    [CONFIRM]: {
      title: 'Confirm Deposit',
      message: 'Are you sure you want to fund this deposit?',
      rightBtn: [
        'Fund',
        accepted ? 'btn-primary' : 'btn-default cursor-not-allowed',
        accepted ? 'enabled' : 'disabled',
      ],
      leftBtn: ['Approved!', 'btn-default cursor-not-allowed', 'disabled'],
      clickMethod: confirmMethod,
    },
    [APPROVE]: {
      title: 'Approve Deposit',
      message: 'Approve your ERC20 for the deposit:',
      rightBtn: ['Fund', 'btn-default cursor-not-allowed', 'disabled'],
      leftBtn: [
        'Approve',
        accepted ? 'btn-primary' : 'btn-default cursor-not-allowed',
        accepted ? 'enabled' : 'disabled',
      ],
      clickMethod: confirmMethod,
    },
    [APPROVING]: {
      title: 'Approving Deposit...',
      message: 'Approving...',
      rightBtn: ['Fund', 'btn-default cursor-not-allowed', 'disabled'],
      leftBtn: ['Approving...', 'btn-primary cursor-not-allowed', 'disabled'],
    },
    [TRANSFERRING]: {
      title: 'Transferring Deposit...',
      message: 'Transferring...',
      rightBtn: ['Funding...', 'btn-primary cursor-not-allowed', 'disabled'],
      leftBtn: ['Approved!', 'btn-default cursor-not-allowed', 'disabled'],
    },
    [SUCCESS]: {
      link: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`,
      title: 'Transfer Complete!',
      rightBtn: ['', 'hidden', ''],
      leftBtn: ['', 'hidden', ''],
    },
    [ERROR]: {
      link: error.link,
      linkText: `${error.linkText}`,
      title: `${error.title}`,
      message: `${error.message}`,
      rightBtn: ['Close', 'btn-default', 'enabled'],
      leftBtn: ['', 'hidden', ''],
      clickMethod: () => updateModal(),
    },
  };

  const tweetText = `💸 Just funded this issue from ${bounty.owner}/${bounty.repoName} on OpenQ, looking for devs to work on it: `;

  const usableVolume = Math.round(volume * Math.pow(10, 10)) / Math.pow(10, 10);
  const fundButton = (
    <div className='flex gap-2'>
      {/* Left Button */}
      {token.address !== '0x0000000000000000000000000000000000000000' && !allowance && (
        <button
          disabled={statesFormat[approveTransferState].leftBtn[2] == 'disabled'}
          onClick={statesFormat[approveTransferState].clickMethod}
          className={`flex gap-2 items-center ${statesFormat[approveTransferState].leftBtn[1]}`}
        >
          {statesFormat[approveTransferState].leftBtn[0]}
          {approveTransferState == 'APPROVING' && <LoadingIcon />}
        </button>
      )}
      {/* Right Button */}
      <button
        disabled={statesFormat[approveTransferState].rightBtn[2] == 'disabled'}
        onClick={statesFormat[approveTransferState].clickMethod}
        className={`flex gap-2 items-center ${statesFormat[approveTransferState].rightBtn[1]}`}
      >
        {statesFormat[approveTransferState].rightBtn[0]}
        {approveTransferState == 'TRANSFERRING' && <LoadingIcon />}
      </button>
      {approveTransferState == SUCCESS && <TweetAbout tweetText={tweetText} bounty={bounty} />}
      {/* <button onClick={openInvoicingModal} className='flex gap-2 items-center btn-primary'>
            <span>{invoicingData && 'Add'} Invoicing Details</span>
            {approveTransferState === TRANSFERRING && <LoadingIcon />}
          </button>*/}
    </div>
  );

  return (
    <ModalDefault
      title={statesFormat[approveTransferState].title}
      footerRight={fundButton}
      setShowModal={updateModal}
      resetState={closeModal}
    >
      {/* Body */}
      {approveTransferState === 'ERROR' ? (
        <div className='text-md pb-4'>
          <p className='break-words'>{statesFormat[approveTransferState].message}</p>
          {statesFormat[approveTransferState].link && (
            <p className='break-all underline'>
              <Link href={statesFormat[approveTransferState].link} target={'_blank'} rel='noopener noreferrer'>
                <>
                  {statesFormat[approveTransferState].linkText || statesFormat[approveTransferState].link}
                  <LinkText />
                </>
              </Link>
            </p>
          )}
        </div>
      ) : (
        <>
          {(approveTransferState === 'APPROVING' || approveTransferState === 'TRANSFERRING') && (
            <div className='bg-info border-info-strong border-2 p-3 rounded-sm mb-4'>
              Please confirm this transaction via your wallet!
            </div>
          )}
          <div className='gap-4 grid grid-cols-[150px_1fr]'>
            <div>Deposit:</div>
            <div className='flex  gap-4'>
              <TokenStats pickedNft={pickedNft} volume={usableVolume} token={token} />
            </div>
            <span>Issue: </span>
            {bounty.url && (
              <Link href={bounty.url} target='_blank' rel='noopener noreferrer' className='underline w-full truncate'>
                <span>{bounty.title}</span>
              </Link>
            )}
            <span>Locked until:</span>
            <span>{appState.utils.formatUnixDate(parseInt(Date.now() / 1000) + depositPeriodDays * 60 * 60 * 24)}</span>
            <span>To Address:</span>
            <CopyAddressToClipboard data={bounty.bountyAddress} clipping={[5, 39]} />
            {approveTransferState == SUCCESS && (
              <>
                <span className='pr-8'>Transaction:</span>
                <Link
                  href={statesFormat[approveTransferState].link}
                  target={'_blank'}
                  className='underline'
                  rel='noopener noreferrer'
                >
                  <>
                    {transactionHash.slice(0, 5)}. . .{transactionHash.slice(62)}
                    <LinkText />
                  </>
                </Link>
              </>
            )}
            {(approveTransferState !== 'ERROR' || approveTransferState !== 'SUCCESS') && (
              <div className='flex items-center col-span-2 pb-2 gap-2 font-semibold'>
                I accept the{''}
                <Link className='underline' href={'/terms-of-use'}>
                  terms of use
                </Link>
                <input
                  aria-label='accept terms of service'
                  type='checkbox'
                  className='checkbox'
                  onChange={handleAccept}
                ></input>
              </div>
            )}
            <div className='col-span-2'>{statesFormat[approveTransferState].message}</div>
          </div>
        </>
      )}
      <GnosisWarning />
    </ModalDefault>
  );
};

export default ApproveFundModal;
