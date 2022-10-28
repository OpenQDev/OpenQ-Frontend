import React, { useEffect } from 'react';
import { metaMask, walletConnect } from './connectors';
import useWeb3 from '../../hooks/useWeb3';
import Image from 'next/image';

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
  }),
    [account];
  return (
    <div>
      <div
        id='connect-modal'
        className='text-[#c9d1d9] absolute top-0 left-0 right-0 h-screen flex justify-center items-center'
      >
        <div className='max-w-md w-5/6 bg-dark-mode z-[60] flex flex-col gap-2 p-6 px-12 rounded-sm '>
          <div>
            <Image alt={'openq-logo'} src={'/openq-logo-white-2.png'} height={32} width={32} />
          </div>
          <h2 className='text-3xl'>Connect Wallet</h2>
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
            Are you using Gnosis Safe? For the best experience use OpenQ as a Safe App. For more information on safe
            apps, check out{' '}
            <a className='underline' href='https://help.gnosis-safe.io/en/articles/4022030-add-a-custom-safe-app'>
              Add a Custom Safe App
            </a>
            .
          </p>
          <button onClick={closeModal} className='btn-default w-full'>
            Close
          </button>
        </div>
      </div>
      <div onClick={closeModal} className='bg-overlay z-40 top-0 left-0 right-0 h-screen absolute'></div>
    </div>
  );
};
export default ConnectModal;
