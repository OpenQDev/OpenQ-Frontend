import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useWeb3 from '../../../../hooks/useWeb3';
import StoreContext from '../../../../store/Store/StoreContext';
import LoadingIcon from '../../../Loading/ButtonLoadingIcon';
import ShieldCheck from '../../../svg/shieldCheck';

const KycRequirement = () => {
  const [stage, setStage] = useState('start');
  const [failResponse, setFailResponse] = useState(null);
  const [successResponse, setSuccessResponse] = useState(null);
  const [error, setError] = useState('');
  const [appState] = useContext(StoreContext);
  const { account, library } = useWeb3();
  const disabled = stage == 'processing' || stage == 'verified';
  useEffect(() => {
    if (failResponse == 'cancelled') {
      setStage('start');
      setFailResponse(null);
    }
    if (successResponse) {
      setStage('verified');
      setError('');
      setSuccessResponse(null);
    }
  }, [failResponse, successResponse]);
  useEffect(() => {
    hasKYC();
  }, []);
  const onOpenSDK = useCallback(async () => {
    try {
      const { KycDaoClient } = await import('@kycdao/widget');

      new KycDaoClient({
        parent: '#modalroot',
        config: {
          demoMode: false,
          enabledBlockchainNetworks: ['PolygonMainnet'],
          enabledVerificationTypes: ['KYC'],
          evmProvider: window.ethereum,
          baseUrl: 'https://kycdao.xyz',
          // test: 'https://staging.kycdao.xyz', 'PolygonMumbai'
          // prod: 'https://kycdao.xyz', 'PolygonMainnet'
        },
        onFail: setFailResponse,
        onSuccess: setSuccessResponse,
      }).open();
      setStage('processing');
    } catch (error) {
      setError(error);
      setStage('start');
      appState.logger.error(error, 'KycRequirement.js1');
    }
  }, []);
  // [WIP] make sure we get the update of hasKYC when the information changes
  const hasKYC = async () => {
    console.log(account);
    try {
      const transaction = await appState.openQClient.hasKYC(library, account);
      if (transaction) {
        setStage('verified');
        setError('');
      }
    } catch (err) {
      appState.logger.error(err, account, 'KycRequirement.js1');
      const { message, title } = appState.openQClient.handleError(err, {
        account,
      });
      setError({ message, title });
    }
  };
  return (
    <section className='flex flex-col gap-3'>
      <h4 className='flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
        <Image src='/kycDao-logo.svg' width={130} height={130} alt='kycDao-logo' />
        <div
          className={`${
            stage == 'verified' ? 'bg-[#1c6f2c] border-[#2ea043]' : 'bg-info  border-info-strong'
          } border-2 text-sm px-2 rounded-full h-6`}
        >
          {stage == 'verified' ? 'Approved' : 'Required'}
        </div>
      </h4>
      {error && !(stage == 'verified') && (
        <div className='bg-info border-info-strong border-2 p-3 rounded-sm'>
          Something went wrong, please try again or reach out for support at{' '}
          <Link
            href='https://discord.gg/puQVqEvVXn'
            rel='noopener norefferer'
            target='_blank'
            className='underline col-span-2'
          >
            OpenQ
          </Link>{' '}
          or{' '}
          <Link
            href='https://discord.kycdao.xyz/'
            rel='noopener norefferer'
            target='_blank'
            className='underline col-span-2'
          >
            KYC DAO
          </Link>
          .
        </div>
      )}
      <div className='font-semibold'>What is kycDAO?</div>
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
        disabled={disabled}
        className={`flex items-center gap-2 ${
          stage == 'start'
            ? 'btn-requirements'
            : stage == 'processing'
            ? 'btn-processing cursor-not-allowed'
            : 'btn-verified cursor-not-allowed'
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
