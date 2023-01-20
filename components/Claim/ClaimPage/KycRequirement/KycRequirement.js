import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import LoadingIcon from '../../../Loading/ButtonLoadingIcon';
import ShieldCheck from '../../../svg/shieldCheck';

const KycRequirement = ({ bounty }) => {
  const [stage, setStage] = useState('start');
  const onOpenSDK = useCallback(async () => {
    const { KycDaoClient } = await import('@kycdao/widget');

    new KycDaoClient({
      parent: '#modalroot',
      config: {
        demoMode: false,
        enabledBlockchainNetworks: ['PolygonMainnet'],
        enabledVerificationTypes: ['KYC'],
        evmProvider: window.ethereum,
        baseUrl: 'https://kycdao.xyz',
      },
    }).open();

    setStage('processing');
  }, []);
  return (
    <section className='flex flex-col gap-3'>
      <h4 className='flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
        <Image src='/kycDao-logo.svg' width={130} height={130} alt='kycDao-logo' />
        <div className='bg-info border-2 border-info-strong text-sm px-2 rounded-full h-6'>Required</div>
      </h4>
      <div>
        kycDAO is a multichain platform for issuing reusable, onchain KYC verifications.
        <div>
          Learn more{' '}
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
      </div>
      <div className='font-semibold'>Verify now</div>
      <button
        className={`flex items-center gap-2 ${
          stage == 'start' ? 'btn-requirements' : stage == 'processing' ? 'btn-processing' : 'btn-verified'
        } w-fit`}
        onClick={onOpenSDK}
      >
        <ShieldCheck className={'w-4 h-4 fill-primary'} />
        {stage == 'verified' ? 'Verified' : 'Start'}
        {stage == 'processing' && <LoadingIcon />}
      </button>
    </section>
  );
};

export default KycRequirement;
