import React, { useEffect } from 'react';
import { metaMask, walletConnect } from './connectors';
import useWeb3 from '../../hooks/useWeb3';
import Image from 'next/image';
import ModalLarge from '../Utils/ModalLarge';

const ConnectModal = ({ closeModal }) => {
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
    <ModalLarge
      title={'Connect Wallet'}
      footerRight={btn}
      /* setShowModal={setShowApproveTransferModal} */
      resetState={closeModal}
    >
      <p className='text-sm'>
        Connect your wallet to continue with OpenQ. By connecting your wallet you agree with OpenQ{"'"}s terms of
        service.
      </p>
      <button
        onClick={handleMetaMask}
        className='flex flex-wrap sm:flew-row sm:py-4 mt-4 my-2 w-full gap-4 hover:bg-[#21262d] hover:text-white rounded-sm hover:border-gray-700 border border-transparent justify-center'
      >
        <Image src={'/wallet-logos/metamask.png'} height={40} width={40} alt={'metamask logo'} />
        <div className='text-lg leading-loose'>Metamask</div>
      </button>
      <button
        onClick={handleWalletConnect}
        className='flex flex-wrap sm:flew-row sm:py-4 mb-4 w-full gap-4 hover:bg-[#21262d] hover:text-white rounded-sm hover:border-gray-700 border border-transparent justify-center'
      >
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
        <a className='underline' href='https://help.gnosis-safe.io/en/articles/4022030-add-a-custom-safe-app'>
          Add a Custom Safe App
        </a>
        .
      </p>
    </ModalLarge>
  );
};
export default ConnectModal;
