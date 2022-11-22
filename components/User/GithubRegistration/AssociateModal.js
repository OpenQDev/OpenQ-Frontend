// Third party
import React, { useContext, useState, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

// Custom
import useAuth from '../../../hooks/useAuth';
import StoreContext from '../../../store/Store/StoreContext';
import useWeb3 from '../../../hooks/useWeb3';
import ModalDefault from '../../Utils/ModalDefault';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import LinkText from '../../svg/linktext';

const AssociateModal = ({ enableLink, btnText, activeBtnStyles, setExternalUserId }) => {
  const { account } = useWeb3();
  const [appState, dispatch] = useContext(StoreContext);
  const { logger } = appState;
  const [showModal, setShowModal] = useState(false);
  const [associateState, setAssociateState] = useState();
  const [transactionHash, setTransactionHash] = useState(null);
  const canvas = useRef();
  const [error, setError] = useState('');
  const [authState] = useAuth();
  const { githubId } = authState;
  const handleClose = () => {
    setShowModal();
  };
  const associateExternalIdToAddress = async () => {
    setAssociateState('TRANSACTION_SUBMITTED');
    setShowModal(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_ORACLE_URL}/associateUserIdToAddress`,
        {
          userId: githubId,
          userAddress: account,
        },
        { withCredentials: true }
      )
      .then(async (result) => {
        const { txnHash } = result.data;
        setExternalUserId(githubId);
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
          appState.logger.error(err);
        }
      })
      .catch((err) => {
        if (err.message.includes(canvas)) return;
        logger.error(err, account, githubId);
        setAssociateState('ERROR');
        setError({ message: err.response.data.errorMessage, title: 'Error' });
      });
  };
  const statesFormat = {
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
  const btn = showModal && (
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
      <button
        disabled={!enableLink}
        className={enableLink ? ` ${activeBtnStyles}  w-full btn-primary` : 'max-w-[340px] w-full btn-default'}
        onClick={associateExternalIdToAddress}
      >
        {btnText}
      </button>
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
