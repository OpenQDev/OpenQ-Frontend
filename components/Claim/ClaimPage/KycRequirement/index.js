import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useIsOnCorrectNetwork from '../../../../hooks/useIsOnCorrectNetwork';
import useWeb3 from '../../../../hooks/useWeb3';
import StoreContext from '../../../../store/Store/StoreContext';
import LoadingIcon from '../../../Loading/ButtonLoadingIcon';
import ShieldCheck from '../../../svg/shieldCheck';
import ConnectButton from '../../../WalletConnect/ConnectButton';
import WalletConnectProvider from '@walletconnect/web3-provider';

const KycRequirement = ({ setKycVerified }) => {
  const [stage, setStage] = useState('start');
  const [failResponse, setFailResponse] = useState(null);
  const [successResponse, setSuccessResponse] = useState(null);
  const [error, setError] = useState('');
  const [appState] = useContext(StoreContext);
  const { chainId, account, library } = useWeb3();
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const disabled = stage == 'processing' || stage == 'verified';

  //  Create WalletConnect Provider
  const wcProvider = new WalletConnectProvider({
    rpc: {
      137: 'https://rpc-mainnet.maticvigil.com/v1/258e87c299409a354a268f96a06f9e6ae7ab8cea',
    },
  });

  //  Enable session (triggers QR Code modal)
  useEffect(async () => {
    await wcProvider.enable();
  }, []);

  const provider = (library && window?.ethereum) || wcProvider;

  useEffect(() => {
    if (failResponse == 'cancelled') {
      setStage('start');
      setFailResponse(null);
    }
    if (successResponse) {
      setStage('verified');
      setKycVerified && setKycVerified(true);
      setError('');
      setSuccessResponse(null);
    }
  }, [failResponse, successResponse]);
  useEffect(() => {
    // chainId to 80001 if tested on Mumbai
    if (account && chainId == 137) hasKYC();
  }, [chainId, account]);
  const onOpenSDK = useCallback(async () => {
    try {
      const { KycDaoClient } = await import('@kycdao/widget');

      new KycDaoClient({
        parent: '#modalroot',
        config: {
          demoMode: false,
          enabledBlockchainNetworks: ['PolygonMainnet'],
          enabledVerificationTypes: ['KYC'],
          evmProvider: provider,
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
    try {
      const transaction = await appState.openQClient.hasKYC(library, account);
      if (transaction) {
        setStage('verified');
        setKycVerified && setKycVerified(true);
        setError('');
      }
    } catch (err) {
      appState.logger.error(err, account, 'KycRequirement.js2');
    }
  };
  return (
    <section className='flex flex-col gap-3'>
      <h4 className='flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
        <Image src='/kycDao-logo.svg' width={132} height={32} alt='kycDao-logo' priority={true} />
        <div
          className={`${
            stage == 'verified'
              ? 'bg-[#1c6f2c] border-[#2ea043]'
              : setKycVerified
              ? 'bg-info  border-info-strong'
              : 'hidden'
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
        kycDAO is a multichain platform for issuing reusable, on-chain KYC verifications.
        <div>
          Learn more about kycDAO{' '}
          <Link
            href='https://kycdao.xyz/home'
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            here
          </Link>
          .
        </div>
      </div>
      <div className='font-semibold'>Verify now</div>
      <ConnectButton nav={false} needsGithub={false} centerStyles={true} tooltipAction={'start the KYC process.'} />
      {isOnCorrectNetwork && account && (
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
      )}
      <div className='italic'>
        * kycDAO and OpenQ do not process personally identifiable information (PII) submitted for KYC. <br />
        This information is processed by{' '}
        <Link
          target='_blank'
          rel='noopener noreferrer'
          className='text-link-colour hover:underline'
          href='https://withpersona.com/security'
        >
          Persona
        </Link>
        .
      </div>
    </section>
  );
};

export default KycRequirement;
