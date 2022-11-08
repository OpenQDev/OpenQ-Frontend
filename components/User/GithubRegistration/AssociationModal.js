// Third party
import React, { useContext, useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/router';

// Custom
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import useAuth from '../../../hooks/useAuth';
import StoreContext from '../../../store/Store/StoreContext';
import useWeb3 from '../../../hooks/useWeb3';
import ModalDefault from '../../../components/Utils/ModalDefault';
import LoadingIcon from '../../../components/Loading/ButtonLoadingIcon';
import ToolTipNew from '../../Utils/ToolTipNew';
import LinkText from '../../../components/svg/linktext';

const AssociationModal = ({ githubId, user, redirectUrl, renderError }) => {
  const { account, library } = useWeb3();
  const [appState, dispatch] = useContext(StoreContext);
  const { logger } = appState;
  const [relAccount, setRelAccount] = useState(account);
  const [showModal, setShowModal] = useState(false);
  const [associateState, setAssociateState] = useState();
  const [transactionHash, setTransactionHash] = useState(null);
  const [enableLink, setEnableLink] = useState();
  const canvas = useRef();
  const [error, setError] = useState('');
  const [authState] = useAuth();
  const router = useRouter();

  const onInput = (e) => {
    setRelAccount(e.target.value);
    if (ethers.utils.isAddress(e.target.value)) {
      setEnableLink(true);
    } else {
      setEnableLink();
    }
  };
  useEffect(() => {
    if (ethers.utils.isAddress(account)) {
      setRelAccount(ethers.utils.getAddress(account));
      setEnableLink(true);
    }
  }, [account]);

  const associateExternalIdToAddress = async () => {
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
        redirectUrl && router.push(`${redirectUrl}`);
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
        relAccount
      )}) and GitHub account were successfully associated!
      \nYou can now participate in Hackathons!`,
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
    <div className='sm:flex flex-wrap items-center pt-8 px-8 gap-4'>
      <div ref={canvas}></div>
      {user ? (
        <div className='flex flex-col gap-4'>
          {!authState.isAuthenticated ? (
            <div className='col-span-3 border border-gray-700 bg-[#21262d] rounded-sm p-4'>
              We noticed you are not signed in with Github. You must sign to verify to link your an address to your
              github!
            </div>
          ) : null}
          <div className='font-semibold'>
            Link your address here in order to receive prize payouts in our seasonal hackathons! You can change this at
            any time.
          </div>
          <div>Enter your wallet address:</div>
          <div className='flex gap-4 asdf s w-80'>
            <input
              className={'flex-1 input-field'}
              id='name'
              placeholder='Enter your wallet address...'
              autoComplete='off'
              type='text'
              value={relAccount}
              onChange={(e) => onInput(e)}
            />
          </div>
          <ToolTipNew toolTipText={'Please enter a valid ethereum address'} hideToolTip={enableLink}>
            <button
              disabled={!enableLink}
              className={enableLink ? 'w-fit btn-primary' : 'w-fit btn-default'}
              onClick={associateExternalIdToAddress}
            >
              Associate Ethereum Address to your Github
            </button>
          </ToolTipNew>
        </div>
      ) : (
        <UnexpectedErrorModal error={renderError} />
      )}
      <>
        {showModal && (
          <ModalDefault
            title={statesFormat[associateState].title}
            footerRight={btn}
            setShowModal={setShowModal}
            resetState={setAssociateState}
          >
            <div className='whitespace-pre-wrap'>{statesFormat[associateState].message}</div>
            <p className='flex justify-between pt-4'>
              <span>Transaction:</span>
              {transactionHash && (
                <a href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`}>
                  {transactionHash.slice(0, 4)}...{transactionHash.slice(63)}
                  <LinkText />
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
