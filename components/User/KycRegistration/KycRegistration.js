import Link from 'next/link';
import React, { useCallback } from 'react';

const KycRegistration = () => {
  const onOpenSDK = useCallback(async () => {
    const { KycDaoClient } = await import('@kycdao/kycdao-web-sdk');

    new KycDaoClient({
      configFromUrl: false,
      parent: '#kyc-container',
      config: {
        demoMode: false,
        enabledBlockchainNetworks: ['PolygonMumbai', 'EthereumGoerli', 'CeloAlfajores'],
        enabledVerificationTypes: ['KYC'],
        evmProvider: window.ethereum,
        baseUrl: 'https://staging.kycdao.xyz',
      },
      width: '400px',
      height: '650px',
    }).open();
  }, []);
  return (
    <div className='border-b border-web-gray sm:flex flex-wrap pb-8 mb-8 gap-y-4'>
      <h2 className='text-2xl pb-4 font-semibold'>Perform KYC via KycDAO</h2>
      <div>
        Due to current regulations, it may sometimes be necessary for you to perform a KYC registration to receive
        specific prizes displayed on OpenQ. We use the KycDAO process. You can learn more about it{' '}
        <Link
          href='https://kycdao.xyz/home'
          rel='noopener norefferer'
          target='_blank'
          className='text-blue-500 hover:underline col-span-2'
        >
          here
        </Link>
        .
      </div>
      <button className='my-2 btn-primary w-fit cursor-pointer' onClick={onOpenSDK}>
        Start KYC
      </button>
    </div>
  );
};

export default KycRegistration;
