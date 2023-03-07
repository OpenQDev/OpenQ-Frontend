import React, { useEffect, useContext } from 'react';
import { metaMask, walletConnect } from './connectors';
import useWeb3 from '../../hooks/useWeb3';
import Image from 'next/image';
import ModalLarge from '../Utils/ModalLarge';
import StoreContext from '../../store/Store/StoreContext';

const ConnectModal = ({ closeModal, setShowModal }) => {
  const { account } = useWeb3();
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;

  const handleMetaMask = async () => {
    try {
      if (!metaMask) return;
      await metaMask.activate();
      closeModal();
    } catch (err) {
      appState.logger.info(err, accountData?.id, 'ConnectModal.js');
    }
  };

  const handleWalletConnect = async () => {
    try {
      if (!walletConnect) return;
      await walletConnect.activate();
      closeModal();
    } catch (err) {
      appState.logger.info(err, accountData?.id, 'ConnectModal.js');
    }
  };

  useEffect(() => {
    if (account) {
      closeModal();
    }
  }, [account]);

  const btn = (
    <button onClick={closeModal} className='btn-default w-full'>
      Close
    </button>
  );

  return (
    <ModalLarge
      isWalletConnect={true}
      title={'Connect Wallet'}
      footerRight={btn}
      setShowModal={setShowModal}
      resetState={closeModal}
    >
      <div className='p-4'>
        <p className='text-xl pt-2'>
          Connect your wallet to continue with OpenQ. By connecting your wallet you agree with OpenQ{"'"}s{' '}
          <a className='hover:underline text-blue-400' target='_blank' rel='noopener noreferrer' href='/terms-of-use'>
            terms of service
          </a>
          .
        </p>
        <button onClick={handleMetaMask} className='flex py-4 pl-4 my-8 w-full gap-8 btn-default'>
          <Image src={'/wallet-logos/metamask.png'} height={40} width={40} alt={'metamask logo'} />
          <div className='text-lg leading-loose'>Metamask</div>
        </button>
        <button onClick={handleWalletConnect} className='flex py-4 pl-4 mb-8 w-full gap-8 btn-default'>
          <Image
            src={'/wallet-logos/wallet-connect.jpg'}
            className='rounded-full'
            height={40}
            width={40}
            alt={'wallet connect logo'}
          />
          <div className='leading-loose text-lg'>WalletConnect</div>
        </button>
      </div>
    </ModalLarge>
  );
};
export default ConnectModal;
