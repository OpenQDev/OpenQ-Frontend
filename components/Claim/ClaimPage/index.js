// Third party Libraries
import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import Link from 'next/link';

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
import Invoicing from '../Invoicing';
import W8Form from './W8Form';
// import FreelancerDetails from '../../User/InvoicingDetailsTab/FreelancerDetails';
// import { valueToDisplay, listWordsWithAnd } from '../../../services/utils/lib';
import KycRequirement from './KycRequirement';
import GithubRequirement from './GithubRequirement';
// import { ChevronUpIcon, ChevronDownIcon } from '@primer/octicons-react';

const ClaimPage = ({ bounty, refreshBounty, price, split, setInternalMenu }) => {
  const { url } = bounty;
  const [appState, dispatch] = useContext(StoreContext);
  const { accountData } = appState;
  const { account, library } = useWeb3();
  const [ensName] = useEns(account);
  // State
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState(null);
  const [claimState, setClaimState] = useState(CONFIRM_CLAIM);
  const [showClaimLoadingModal, setShowClaimLoadingModal] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  // const { accountData } = appState;
  const [kycVerified, setKycVerified] = useState(null);
  const [githubHasWalletVerified, setGithubHasWalletVerified] = useState(null);
  const supportingDocumentsCompleted =
    bounty.supportingDocumentsCompleted && bounty.supportingDocumentsCompleted[targetTier];
  const invoiceCompleted = bounty.invoiceCompleted && bounty.invoiceCompleted[targetTier];

  const checkRequirementsWithGraph = (bounty) => {
    if (bounty.bountyType === '2' || bounty.bountyType === '3') {
      let w8Form = !bounty.supportingDocumentsRequired || supportingDocumentsCompleted;
      let invoice = !bounty.invoiceRequired || invoiceCompleted;
      return { w8Form, invoice };
    } else return {};
  };
  const targetTier = bounty.tierWinners.indexOf(accountData.github);

  const { w8Form, invoice } = checkRequirementsWithGraph(bounty);
  let kyc = !bounty.kycRequired || kycVerified;
  let githubHasWallet = bounty.bountyType == 0 || bounty.bountyType == 1 || githubHasWalletVerified;
  let claimable = kyc && w8Form && githubHasWallet && invoice;

  useEffect(() => {
    claimable = kyc && w8Form && githubHasWallet && invoice;
  }, [kyc, w8Form, githubHasWallet, invoice]);

  /* const accountKeys = [
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
  ]; */
  const { bountyType } = bounty;
  /* const neededAccountData = accountKeys.filter((key) => {
    return !accountData[key];
  });
  const hasInvoicingInfo = neededAccountData.length === 0 || !bounty.invoiceRequired; */

  const canvas = useRef();

  const { logger } = appState;

  const showBountyClosed = bounty.status == '1' && (bounty.bountyType == 2 ? price == 0 : true);

  const updateModal = () => {
    setShowClaimLoadingModal(false);
    if (claimState === TRANSACTION_CONFIRMED) {
      refreshBounty();
      setInternalMenu('Claims Overview');
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
    const promise = new Promise(async (resolve, reject) => {
      try {
        if ((bounty.bountyType === '2') | (bounty.bountyType === '3')) {
          const pr = bounty?.prs?.find((pr) => pr?.source?.author?.id === accountData?.github);
          const prUrl = pr ? pr?.source.url : null;
          const externalUserId = accountData.github;
          const closerAddress = account;
          const tier = targetTier;
          const result = await appState.openQClient.claimTieredPermissioned(
            library,
            bounty,
            externalUserId,
            closerAddress,
            prUrl,
            tier
          );
          resolve(result);
        } else {
          const result = await axios.post(
            `${process.env.NEXT_PUBLIC_ORACLE_URL}/claim`,
            {
              issueUrl: url,
              payoutAddress: account,
            },
            { withCredentials: true }
          );
          resolve(result.txnHash);
        }
      } catch (e) {
        reject(e);
      }
    });
    try {
      const txnHash = await promise;
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
    } catch (err) {
      if (bountyType === '2' || bountyType === '3') {
        if (err.message.includes('TIER_ALREADY_CLAIMED')) {
          setClaimState(WITHDRAWAL_INELIGIBLE);
          setError({
            message: 'Tier already claimed',
            title: 'Error',
          });
        } else {
          setClaimState(WITHDRAWAL_INELIGIBLE);
          setError({
            message: 'Error claiming bounty',
            title: 'Error',
          });
        }
      } else {
        logger.error(err, account, bounty.id);
        setClaimState(WITHDRAWAL_INELIGIBLE);
        setError({
          message: err.response.data.errorMessage,
          title: 'Error',
          referencedPrs: err.response.data.referencedPrs,
        });
      }
    }
  };

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
        <div className='flex-1 pt-4 pb-8 w-full max-w-[1200px]'>
          <div className='flex flex-col w-full space-y-2 rounded-sm gap-4'>
            <div
              className={`${
                claimable ? 'border-green bg-green-inside' : 'bg-info border-info-strong'
              } border-2 p-3 rounded-sm`}
            >
              {claimable ? (
                'Congratulations, you can now claim your bounty!'
              ) : (
                <>
                  Congratulations, you are elgible to receive this bounty! In order to claim it you need to fulfill
                  therequirements highlighted below. To learn more read{' '}
                  <Link href='/' rel='noopener norefferer' target='_blank' className='underline col-span-2'>
                    here
                  </Link>
                  .
                </>
              )}
            </div>
            <h3 className='flex w-full text-3xl font-semibold text-primary'>Requirements</h3>
            {bounty.kycRequired && <KycRequirement setKycVerified={setKycVerified} />}
            {bounty.supportingDocumentsRequired && <W8Form bounty={bounty} />}
            <GithubRequirement setGithubHasWalletVerified={setGithubHasWalletVerified} />
            <Invoicing bounty={bounty} />
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
                  hideToolTip={price > 0 && claimable}
                  toolTipText={
                    price <= 0 || !price
                      ? 'There are no funds locked to claim, contact the maintainer of this issue.'
                      : 'Please first go through all the required steps before you can claim your rewards.'
                  }
                >
                  <button
                    type='submit'
                    className={
                      price > 0 && claimable ? 'btn-primary cursor-pointer w-fit' : 'btn-default cursor-not-allowed'
                    }
                    disabled={!(price > 0 && claimable)}
                    onClick={() => setShowClaimLoadingModal(true)}
                  >
                    Claim
                  </button>
                </ToolTipNew>
              </div>
            )}

            {/* {bounty.invoiceRequired && (
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
            )} */}
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
