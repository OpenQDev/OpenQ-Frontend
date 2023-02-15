// Third party
import React, { useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

// Custom
import StoreContext from '../../../store/Store/StoreContext';
import useWeb3 from '../../../hooks/useWeb3';
import ModalDefault from '../../Utils/ModalDefault';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import LinkText from '../../svg/linktext';
import AuthContext from '../../../store/AuthStore/AuthContext';
import ToolTipNew from '../../Utils/ToolTipNew';

const AssociateModal = ({
  enableLink,
  btnText,
  activeBtnStyles,
  setAssociatedAddress,
  setClaimPageError,
  hasAssociatedAddress,
}) => {
  const { account } = useWeb3();
  const [appState, dispatch] = useContext(StoreContext);
  const [updateAddress, setUpdateAddress] = useState(false);
  const { accountData } = appState;
  const { logger } = appState;
  const [showModal, setShowModal] = useState(false);
  const [associateState, setAssociateState] = useState();
  const [transactionHash, setTransactionHash] = useState(null);
  const canvas = useRef();
  const [error, setError] = useState('');
  const [authState] = useContext(AuthContext);
  const { githubId } = authState;
  const handleClose = () => {
    setShowModal();
  };
  useEffect(() => {
    if (setClaimPageError) setClaimPageError(error);
  }, [error]);
  useEffect(() => {
    if (updateAddress) {
      associateExternalIdToAddress();
      setUpdateAddress(false);
    }
  }, [updateAddress]);

  const associateExternalIdToAddress = async () => {
    setAssociateState('SIGN_MESSAGE');
    setShowModal(true);
    const signature = await appState.openQClient.signMessage(account);
    setAssociateState('TRANSACTION_SUBMITTED');
    axios
      .post(
        `${process.env.NEXT_PUBLIC_ORACLE_URL}/associateUserIdToAddress`,
        {
          userId: githubId,
          userAddress: account,
        },
        { withCredentials: true, headers: { signature } }
      )
      .then(async (result) => {
        const { txnHash } = result.data;
        setAssociatedAddress(account);
        // Upon this return, the associateExternalIdToAddress transaction has been submitted
        setTransactionHash(txnHash);
        setAssociateState('TRANSACTION_CONFIRMED');

        const payload = {
          type: 'UPDATE_RELOAD',
          payload: true,
        };

        dispatch(payload);
        try {
          canvas.current.width = window.innerWidth;
          canvas.current.height = window.innerHeight;

          const canvasConfetti = confetti.create(canvas.current, {
            resize: true,
            useWorker: true,
          });
          canvasConfetti({
            particleCount: 50,
            spread: window.innerWidth,
            origin: {
              x: 1,
              y: 0,
            },
          });
        } catch (err) {
          appState.logger.error(err, accountData.id, 'AboutFreelancer.js1');
        }
      })
      .catch((err) => {
        if (err.message.includes(canvas)) return;
        logger.error(err, account, githubId);
        setAssociateState('ERROR');
        setError({ message: err.response.data.errorMessage, title: 'Error' });
      });
  };
  const changeAccount = async () => {
    await window.ethereum
      .request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
      .catch((error) => appState.logger.error(error, accountData.id, 'AssociateModal.js1'));
    setUpdateAddress(true);
  };
  const statesFormat = {
    SIGN_MESSAGE: {
      title: 'Requesting Your Signature',
      message: 'Please sign with your wallet to prove you own this address.',
      btn: { text: '', disabled: true, format: 'flex items-center btn-default cursor-not-allowed gap-2' },
    },
    TRANSACTION_SUBMITTED: {
      title: 'Associating Your Account...',
      message: 'Your wallet address is being associated with your GitHub account...',
      btn: { text: 'In Progress...', disabled: true, format: 'flex items-center btn-default cursor-not-allowed gap-2' },
    },
    TRANSACTION_CONFIRMED: {
      title: 'Account Successfully Associated!',
      message: `Your wallet address (${appState.utils.shortenAddress(
        account
      )}) and GitHub account were successfully associated!
      \nYou can now participate in Hackathons!`,
      btn: { text: 'Close', disabled: false, format: 'flex btn-default' },
      clickAction: handleClose,
    },
    ERROR: {
      title: error.title,
      message: error.message,
      btn: { text: 'Close', disabled: false, format: 'flex btn-default' },
      clickAction: () => setShowModal(false),
    },
  };
  const btn = showModal && statesFormat[associateState].btn.text && (
    <div>
      <button
        onClick={statesFormat[associateState].clickAction}
        className={statesFormat[associateState].btn.format}
        disabled={statesFormat[associateState].btn.disabled}
      >
        {statesFormat[associateState].btn.text}
        {associateState == 'TRANSACTION_SUBMITTED' && <LoadingIcon />}
      </button>
    </div>
  );

  return (
    <>
      {' '}
      <ToolTipNew
        innerStyles={'flex whitespace-normal w-80'}
        hideToolTip={!hasAssociatedAddress}
        toolTipText={'You will be prompted to change your Metamask account to update your associated address.'}
      >
        <button
          disabled={!enableLink}
          className={enableLink ? ` ${activeBtnStyles}  w-full btn-primary` : 'max-w-[340px] w-full btn-default'}
          onClick={hasAssociatedAddress ? changeAccount : associateExternalIdToAddress}
        >
          {btnText}
        </button>
      </ToolTipNew>
      {showModal && (
        <>
          <ModalDefault
            title={statesFormat[associateState].title}
            footerRight={btn}
            setShowModal={setShowModal}
            resetState={setAssociateState}
          >
            <div className='whitespace-pre-wrap'>{statesFormat[associateState].message}</div>
            <p className='flex justify-between pt-4'>
              {transactionHash && (
                <>
                  <span>Transaction:</span>
                  <a
                    target='_blank'
                    href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`}
                    rel='noreferrer'
                  >
                    {transactionHash.slice(0, 4)}...{transactionHash.slice(63)}
                    <LinkText />
                  </a>
                </>
              )}
            </p>
          </ModalDefault>
        </>
      )}
    </>
  );
};

export default AssociateModal;
