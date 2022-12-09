// Third party
import React, { useState, useEffect, useRef, useContext } from 'react';
import jazzicon from '@metamask/jazzicon';
// Custom
import useWeb3 from '../../hooks/useWeb3';
import useConnectOnLoad from '../../hooks/useConnectOnLoad';
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import AccountModal from './AccountModal';
import ConnectModal from './ConnectModal';
import useEns from '../../hooks/useENS';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import StoreContext from '../../store/Store/StoreContext';
import AuthButton from '../Authentication/AuthButton';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import ToolTipNew from '../Utils/ToolTipNew';
import Image from 'next/image';
import LoginModal from '../Authentication/LoginModal';
// import axios from 'axios';

const ConnectButton = ({ needsGithub, nav, tooltipAction, hideSignOut, centerStyles }) => {
  // Context
  const { chainId, error, account, safe } = useWeb3();
  const [ensName] = useEns(account);
  const [authState] = useAuth();
  const router = useRouter();
  const [appState, dispatch] = useContext(StoreContext);
  const { walletConnectModal } = appState;

  // State
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork({
    chainId: chainId,
    error: error,
    account: account,
  });
  const [showAccountModal, setShowAccountModal] = useState();
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState();
  const iconWrapper = useRef();
  const modalRef = useRef();
  const buttonRef = useRef();
  const profileRef = useRef();

  // Hooks
  if (nav && typeof useConnectOnLoad === 'function') {
    const connectOnLoad = useConnectOnLoad(); // See [useEagerConnect](../../hooks/useEagerConnect.js)

    if (typeof connectOnLoad === 'function') {
      connectOnLoad();
    }
  }

  useEffect(() => {
    const createJazzicon = async () => {
      if (account && iconWrapper.current) {
        iconWrapper.current.innerHTML = '';
        iconWrapper.current.appendChild(jazzicon(26, parseInt(account.slice(2, 10), 16)));
      }
    };
    createJazzicon();
  }, [account, isOnCorrectNetwork, iconWrapper.current]);

  useEffect(() => {
    let handler = (event) => {
      if (!modalRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setShowAccountModal(false);
      }
      if (!modalRef.current?.contains(event.target) && !profileRef.current?.contains(event.target)) {
        setShowProfileModal(false);
      }
    };
    window.addEventListener('mousedown', handler);

    return () => {
      window.removeEventListener('mousedown', handler);
    };
  });

  // Methods
  const openConnectModal = async () => {
    const payload = {
      type: 'CONNECT_WALLET',
      payload: true,
    };
    dispatch(payload);
  };

  const closeModal = () => {
    const payload = {
      type: 'CONNECT_WALLET',
      payload: false,
    };
    dispatch(payload);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    /* const payload = {
      type: '',
      payload: false,
    };
    dispatch(payload); */
  };

  const addOrSwitchNetwork = () => {
    window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['params'],
      })
      .catch((err) => appState.logger.error(err, account));
  };

  // Render
  return (
    <>
      {showLoginModal && <LoginModal closeModal={closeLoginModal} setShowModal={setShowLoginModal} />}
      {needsGithub && !authState.isAuthenticated ? (
        <AuthButton redirectUrl={`${process.env.NEXT_PUBLIC_BASE_URL}` + router.asPath} hideSignOut={hideSignOut} />
      ) : (
        <div className='flex items-center'>
          {account && isOnCorrectNetwork ? (
            <>
              {nav && (
                <div>
                  <button
                    disabled={isConnecting}
                    ref={buttonRef}
                    onClick={() => {
                      setShowAccountModal(!showAccountModal);
                    }}
                    className='group flex items-center gap-x-1 h-12 whitespace-nowrap py-1 px-3 font-semibold cursor-pointer'
                  >
                    <span
                      className='border border-[#8b949e] rounded-full h-7 py-pxt group-hover:border-opacity-70'
                      ref={iconWrapper}
                    ></span>
                    <span className='md:group-hover:opacity-70'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-3 w-3'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='white'
                        strokeWidth='3'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                      </svg>
                    </span>
                  </button>
                  {showAccountModal && (
                    <AccountModal
                      domRef={modalRef}
                      account={account}
                      ensName={ensName}
                      chainId={chainId}
                      setIsConnecting={setIsConnecting}
                      isSafeApp={safe}
                    />
                  )}
                </div>
              )}
            </>
          ) : isOnCorrectNetwork ? (
            <ToolTipNew
              relativePosition={centerStyles ? '' : 'left-0'}
              outerStyles={'-top-1 '}
              groupStyles={centerStyles ? '' : 'w-min'}
              innerStyles={'sm:w-40 md:w-60 whitespace-normal'}
              toolTipText={`Connect your wallet to ${tooltipAction}`}
            >
              <button
                onClick={openConnectModal}
                className='flex w-full items-center justify-center btn-default mr-4 whitespace-nowrap'
                disabled={isConnecting}
              >
                {'Connect Wallet'}
              </button>
            </ToolTipNew>
          ) : (
            <ToolTipNew
              relativePosition={centerStyles ? '' : 'left-0'}
              outerStyles={'-top-1 '}
              groupStyles={centerStyles ? '' : 'w-min'}
              innerStyles={'sm:w-40 md:w-60 whitespace-normal'}
              toolTipText={'Please switch to the correct network to fund this contract.'}
            >
              <button
                onClick={addOrSwitchNetwork}
                className='flex w-full items-center justify-center btn-default mr-4 whitespace-nowrap'
              >
                Use {chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['networkName']} Network
              </button>
            </ToolTipNew>
          )}
          {nav && (
            <div>
              <div className={`flex items-center h-12 content-center`}>
                <button
                  disabled={isConnecting}
                  ref={profileRef}
                  onClick={() => {
                    setShowProfileModal(!showProfileModal);
                  }}
                  className='group flex items-center gap-x-1 h-12 whitespace-nowrap py-1 px-3 font-semibold cursor-pointer'
                >
                  <div className='flex items-center border border-gray-700 hover:border-opacity-70 rounded-full'>
                    {authState.avatarUrl && (
                      <Image
                        src={authState.avatarUrl}
                        width={31}
                        height={31}
                        alt={'profile pic'}
                        className='rounded-full'
                      />
                    )}
                  </div>
                  <span className='md:group-hover:opacity-70'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='white'
                      strokeWidth='3'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                    </svg>
                  </span>
                </button>
              </div>
              {showProfileModal && <AccountModal domRef={modalRef} isSafeApp={safe} />}
            </div>
          )}
          {walletConnectModal && <ConnectModal closeModal={closeModal} setShowModal={setShowAccountModal} />}
        </div>
      )}
    </>
  );
};

export default ConnectButton;
