import React, { useEffect } from 'react';
import { metaMask, walletConnect } from './connectors';
import useWeb3 from '../../hooks/useWeb3';
import Image from 'next/legacy/image';
import ModalLarge from '../Utils/ModalLarge';

const ConnectModal = ({ closeModal, setShowModal }) => {
  const { account } = useWeb3();

  const handleMetaMask = async () => {
    await metaMask.activate();
    closeModal();
  };

  const handleWalletConnect = async () => {
    await walletConnect.activate();
    closeModal();
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
    <ModalLarge title={'Connect Wallet'} footerRight={btn} setShowModal={setShowModal} resetState={closeModal}>
      <p className='text-xl pt-2'>
        Connect your wallet to continue with OpenQ. By connecting your wallet you agree with OpenQ{"'"}s{' '}
        <a
          className='hover:underline text-blue-400'
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.openq.dev/terms-of-service'
        >
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
      <p className='text-sm text-muted pb-4'>
        Are you using Gnosis Safe? For the best experience use OpenQ as a Safe App. For more information on safe apps,
        check out{' '}
        <a
          className='underline'
          target='_blank'
          rel='noopener noreferrer'
          href='https://help.gnosis-safe.io/en/articles/4022030-add-a-custom-safe-app'
        >
          Add a Custom Safe App
        </a>
        .
      </p>
    </ModalLarge>
  );
};
export default ConnectModal;
