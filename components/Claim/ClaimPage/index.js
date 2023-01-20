// Third party Libraries
import React, { useState, useRef, useContext, useCallback } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import Image from 'next/image';

// Custom
import {
  CHECKING_WITHDRAWAL_ELIGIBILITY,
  WITHDRAWAL_INELIGIBLE,
  TRANSACTION_SUBMITTED,
  TRANSACTION_CONFIRMED,
  CONFIRM_CLAIM,
} from '../ClaimStates';
import useWeb3 from '../../../hooks/useWeb3';
import ClaimLoadingModal from '../ClaimLoadingModal';
import CopyAddressToClipboard from '../../CopyAddressToClipboard';
import BountyClosed from '../../BountyClosed';
import useEns from '../../../hooks/useENS';
import ToolTipNew from '../../Utils/ToolTipNew';
import useIsOnCorrectNetwork from '../../../hooks/useIsOnCorrectNetwork';
import StoreContext from '../../../store/Store/StoreContext';
import ConnectButton from '../../WalletConnect/ConnectButton';
import AuthContext from '../../../store/AuthStore/AuthContext';
import { /* ChevronDownIcon, ChevronUpIcon, */ MailIcon, UploadIcon } from '@primer/octicons-react';
//import FreelancerDetails from '../../User/InvoicingDetailsTab/FreelancerDetails';
//import { valueToDisplay, listWordsWithAnd } from '../../../services/utils/lib';
import ShieldCheck from '../../svg/shieldCheck';
import Github from '../../svg/github';

const ClaimPage = ({ bounty, refreshBounty, price, split }) => {
  const { url } = bounty;
  const [appState, dispatch] = useContext(StoreContext);
  const { account, library } = useWeb3();
  const [ensName] = useEns(account);
  // State
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState(null);
  const [claimState, setClaimState] = useState(CONFIRM_CLAIM);
  const [showClaimLoadingModal, setShowClaimLoadingModal] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [missingFields, setMissingFields] = useState(false);
  const { accountData } = appState;
  const profileLink = `${process.env.NEXT_PUBLIC_BASE_URL}/user/${accountData.id}`;
  const handleSendInvoice = async () => {
    try {
      await axios.post(
        `http://localhost:3007/fixedcontest?id=${bounty.bountyAddress}&account=${account}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      if (JSON.parse(err.request.response).missingFields.length) {
        setMissingFields(true);
      }
    }
  };
  const accountKeys = [
    'billingName',
    'city',
    'streetAddress',
    'postalCode',

    'country',

    'phoneNumber',
    'province',
    'invoicingEmail',
    'invoiceNumber',
    'taxId',
    'vatNumber',
    'vatRate',
  ];
  const neededAccountData = accountKeys.filter((key) => {
    return !accountData[key];
  });
  const hasInvoicingInfo = neededAccountData.length === 0 || !bounty.invoiceable;

  const canvas = useRef();

  const { logger } = appState;

  const showBountyClosed = bounty.status == '1' && (bounty.bountyType == 2 ? price == 0 : true);

  const updateModal = () => {
    setShowClaimLoadingModal(false);
    if (claimState === TRANSACTION_CONFIRMED) {
      refreshBounty();
    } else {
      setClaimState(CONFIRM_CLAIM);
    }
  };

  // Context

  // Hooks
  const [authState] = useContext(AuthContext);

  // Methods

  const claimBounty = async () => {
    setClaimState(CHECKING_WITHDRAWAL_ELIGIBILITY);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_ORACLE_URL}/claim`,
        {
          issueUrl: url,
          payoutAddress: account,
        },
        { withCredentials: true }
      )
      .then(async (result) => {
        const { txnHash } = result.data;
        // Upon this return, the claimBounty transaction has been submitted
        // We should now transition from Transaction Submitted -> Transaction Pending
        setTransactionHash(txnHash);
        setClaimState(TRANSACTION_SUBMITTED);
        await library.waitForTransaction(txnHash);
        setClaimState(TRANSACTION_CONFIRMED);
        setJustClaimed(true);

        const payload = {
          type: 'UPDATE_RELOAD',
          payload: true,
        };

        dispatch(payload);

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
      })
      .catch((err) => {
        logger.error(err, account, bounty.id);
        setClaimState(WITHDRAWAL_INELIGIBLE);
        setError({
          message: err.response.data.errorMessage,
          title: 'Error',
          referencedPrs: err.response.data.referencedPrs,
        });
      });
  };

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
  }, []);

  if (showBountyClosed) {
    return bounty.bountyType ? (
      <>
        <BountyClosed bounty={bounty} showTweetLink={justClaimed} />
      </>
    ) : (
      <div className='text-lg'>Bounty type unknown. Please refresh your window.</div>
    );
  } else {
    // rewards are claimable
    return (
      <>
        {console.log(bounty)}
        <div className='flex-1 pt-4 pb-8 w-full max-w-[1200px]'>
          <div className='flex flex-col w-full space-y-2 rounded-sm gap-4'>
            <div className='bg-info border-info-strong border-2 p-3 rounded-sm'>
              Congratulations, you are elgible to receive this bounty! In order to claim it you need to fulfill the
              requriements highlighted below. To learn more read{' '}
              <Link
                href='/'
                rel='noopener norefferer'
                target='_blank'
                className='text-blue-500 hover:underline col-span-2'
              >
                here
              </Link>
              .
            </div>
            <h3 className='flex w-full text-3xl font-semibold text-primary'>Requirements</h3>
            {!bounty.kycRequired && (
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
                <button className='flex items-center gap-2 btn-requirements w-fit' onClick={onOpenSDK}>
                  <ShieldCheck className={'w-4 h-4 fill-primary'} />
                  Start
                </button>
              </section>
            )}
            <section className='flex flex-col gap-3'>
              <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
                Form W8/W9*
                <div className='bg-info border-2 border-info-strong text-sm px-2 rounded-full h-6'>Required</div>
              </h4>
              <div>
                Please complete and upload a form W-8. Choose one of five types, depending on your entity. We encourage
                you to consult with you own tax or financial adviser to determine which form is appropriate for you or
                ask in our
                <div>
                  <Link
                    href={'https://discord.gg/puQVqEvVXn'}
                    rel='noopener norefferer'
                    target='_blank'
                    className='text-blue-500 hover:underline col-span-2'
                  >
                    discord
                  </Link>{' '}
                  for help.
                </div>
              </div>
              <div className='font-semibold'>Upload</div>
              <button className='flex items-center gap-2 btn-requirements w-fit'>
                <UploadIcon size={16} /> Upload
              </button>
              <div className=''>
                *W-8 forms are{' '}
                <Link
                  href={'https://www.irs.gov/'}
                  rel='noopener norefferer'
                  target='_blank'
                  className='text-blue-500 hover:underline col-span-2'
                >
                  Internal Revenue Service
                </Link>{' '}
                (IRS) forms that foreign individuals and businesses must file to verify their country of residence for
                tax purposes, certifying that they qualify for a lower rate of tax withholding.
              </div>
            </section>
            <section className='flex flex-col gap-3'>
              <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
                GitHub
                <div className='bg-info border-2 border-info-strong text-sm px-2 rounded-full h-6'>Required</div>
              </h4>
              <div className='flex items-center gap-2'>
                Associate your GitHub account on-chain{' '}
                <ToolTipNew
                  innerStyles={'whitespace-normal w-60'}
                  toolTipText={
                    'You need to associate a wallet address to your GitHub account in order to be able to receive prizes.'
                  }
                >
                  <div className='cursor-help p-0.25 rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                    ?
                  </div>
                </ToolTipNew>
              </div>
              <button className='flex items-center gap-2 btn-requirements w-fit'>
                <Github className={'h-4 w-4'} />
                Start
              </button>
            </section>
            {bounty.invoiceable && (
              <section className='flex flex-col gap-3'>
                <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
                  Invoice
                  <div className='bg-info border-2 border-info-strong text-sm px-2 rounded-full h-6'>Required</div>
                </h4>
                <p className='font-semibold'>How to use OpenQ's Invoice Generator</p>
                <div>
                  {' '}
                  <p className='font-semibold'>Step 1</p>
                  <p>
                    Please fill in your billing details in your{' '}
                    <Link className='underline' href={profileLink}>
                      profile
                    </Link>{' '}
                    and review the sample invoice.
                  </p>
                </div>
                <div>
                  <p className='font-semibold'>Step 2</p>
                  <p>Send your invoice to complete this requirement.</p>
                </div>
                <button onClick={handleSendInvoice} className='flex items-center gap-2 btn-requirements w-fit'>
                  <MailIcon />
                  Send
                </button>
                {missingFields && (
                  <div className='bg-info border-info-strong border p-4 rounded-sm'>
                    You haven't added all the mandatory fields in your invoice details. Please head to your{' '}
                    <Link className='underline' href={profileLink}>
                      profile
                    </Link>{' '}
                    and add them or ask for help in our{' '}
                    <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
                      discord
                    </a>
                    .
                  </div>
                )}
              </section>
            )}
            <section className='flex flex-col gap-3'>
              <h4 className='flex text-2xl py-2 pt-4 md:border-b border-gray-700'>Claim Your Rewards</h4>
              <div className='flex flex-col gap-2'>
                {bounty.bountyType === '0' && (
                  <>
                    "Don't forget to add a closer comment for this bounty on your pull request :-)."
                    <CopyAddressToClipboard noClip={true} data={`Closes #${bounty.number}`} />
                  </>
                )}
              </div>
            </section>
            {!authState.isAuthenticated ? (
              <div>We noticed you are not signed into Github. You must sign to verify and claim an issue!</div>
            ) : null}
            <ConnectButton needsGithub={true} nav={false} tooltipAction={'claim this contract!'} hideSignOut={true} />
            {account && isOnCorrectNetwork && authState.isAuthenticated && (
              <div className='flex flex-col'>
                <ToolTipNew
                  relativePosition={'-left-2'}
                  triangleStyles={'left-3'}
                  outerStyles={'relative bottom-1'}
                  hideToolTip={price > 0 && hasInvoicingInfo}
                  toolTipText={
                    price <= 0
                      ? 'There are no funds locked to claim, contact the maintainer of this issue.'
                      : !hasInvoicingInfo
                      ? 'This bounty requires invoicing data, please fill in the form below.'
                      : 'Please first go through all the required steps before you can claim your rewards.'
                  }
                >
                  <button
                    type='submit'
                    className={
                      price > 0 && hasInvoicingInfo ? 'btn-primary cursor-pointer' : 'btn-default cursor-not-allowed'
                    }
                    disabled={!(price > 0 && hasInvoicingInfo)}
                    onClick={() => setShowClaimLoadingModal(true)}
                  >
                    Claim
                  </button>
                </ToolTipNew>
              </div>
            )}

            {/*
            {bounty.invoiceable && (
              <>
                {neededAccountData.length > 0 && (
                  <div>
                    Invoicing data required for this bounty, you are missing values for the{' '}
                    {listWordsWithAnd(
                      neededAccountData.map((elem) => {
                        return valueToDisplay(elem);
                      })
                    )}{' '}
                    fields.
                  </div>
                )}
                <details className='w-5/6 group' open={!hasInvoicingInfo}>
                  <summary className='list-none text-2xl text-muted fill-muted cursor-pointer'>
                    Invoicing data{' '}
                    <span className='group-open:hidden'>
                      <ChevronDownIcon size='24px' />
                    </span>
                    <span className='hidden group-open:inline'>
                      <ChevronUpIcon size='24px' />
                    </span>
                  </summary>
                  <FreelancerDetails slim={true} />
                </details>
              </>
            )}*/}
            {showClaimLoadingModal && (
              <ClaimLoadingModal
                confirmMethod={claimBounty}
                url={url}
                ensName={ensName}
                account={account}
                error={error}
                claimState={claimState}
                address={account}
                transactionHash={transactionHash}
                setShowClaimLoadingModal={updateModal}
                bounty={bounty}
                authState={authState}
                price={price}
                split={split}
              />
            )}

            <canvas className='absolute inset-0 pointer-events-none' ref={canvas}></canvas>
          </div>
        </div>
      </>
    );
  }
};

export default ClaimPage;
