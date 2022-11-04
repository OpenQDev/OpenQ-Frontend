// Third party
import React, { useContext, useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import confetti from 'canvas-confetti';

// Custom
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import StoreContext from '../../../store/Store/StoreContext';
import useWeb3 from '../../../hooks/useWeb3';
import ModalDefault from '../../../components/Utils/ModalDefault';
import LoadingIcon from '../../../components/Loading/ButtonLoadingIcon';
const AssociationModal = ({ githubId, user /* , organizations */, renderError }) => {
  const { account, library } = useWeb3();
  const [appState, dispatch] = useContext(StoreContext);
  const { logger } = appState;
  const [relAccount, setRelAccount] = useState(account);
  const [showModal, setShowModal] = useState(false);
  const [associateState, setAssociateState] = useState();
  const [transactionHash, setTransactionHash] = useState(null);
  const canvas = useRef();
  const [error, setError] = useState('');

  function onInput(e) {
    if (ethers.utils.isAddress(e.target.value)) {
      const checkSummedAddress = ethers.utils.getAddress(e.target.value);
      setRelAccount(checkSummedAddress);
    } else {
      alert('address not valid');
    }
  }
  useEffect(() => {
    if (account) {
      setRelAccount(ethers.utils.getAddress(account));
    }
  }, [account]);

  const associateExternalIdToAddress = async () => {
    console.log(relAccount);
    setAssociateState('TRANSACTION_SUBMITTED');
    setShowModal(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_ORACLE_URL}/associateUserIdToAddress`,
        {
          userId: githubId,
          userAddress: relAccount,
        },
        { withCredentials: true }
      )
      .then(async (result) => {
        const { txnHash } = result.data;
        // Upon this return, the associateExternalIdToAddress transaction has been submitted
        setTransactionHash(txnHash);
        await library.waitForTransaction(txnHash);
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
          console.log(err);
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
      message:
        'Your wallet address and GitHub account were successfully associated! \nYou can now participate in Hackathons!',
      btn: { text: 'Close', disabled: false, format: 'flex btn-default' },
      clickAction: () => setShowModal(false),
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
    <div>
      <div ref={canvas}></div>
      <div className='flex gap-4 justify-center items-center pt-6'>
        {user ? (
          <div className='flex flex-col gap-4 p-8 w-1/2'>
            <div>
              You MUST sign up with Github in order to receive prize payouts in our seasonal hackathons! Funds will be
              sent to the address you put here. You can change this at any time.
            </div>
            <div className='flex gap-4'>
              <div>Enter your wallet address:</div>
              <input
                className={'flex-1 input-field w-full'}
                id='name'
                placeholder='Enter your wallet address...'
                autoComplete='off'
                type='text'
                defaultValue={account}
                onChange={(e) => onInput(e)}
              />
            </div>
            <button className='btn-primary' onClick={associateExternalIdToAddress}>
              Associate Ethereum Address to your Github
            </button>
          </div>
        ) : (
          <UnexpectedErrorModal error={renderError} />
        )}
      </div>
      <>
        {showModal && (
          <ModalDefault
            title={statesFormat[associateState].title}
            footerRight={btn}
            setShowModal={setShowModal}
            resetState={setAssociateState}
          >
            {statesFormat[associateState].message}
            <p className='flex justify-between'>
              <span>txnHash:</span>
              {transactionHash && (
                <a href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/${transactionHash}`}>
                  {transactionHash.slice(0, 4)}...{transactionHash.slice(63)}
                </a>
              )}
            </p>
          </ModalDefault>
        )}
      </>
    </div>
  );
};
export default AssociationModal;
