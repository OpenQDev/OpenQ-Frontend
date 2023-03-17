// Third party Libraries
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';

// Custom
import CopyAddressToClipboard from '../../CopyAddressToClipboard';
import BountyClaimed from './BountyClaimed/index.js';
import StoreContext from '../../../store/Store/StoreContext';
import ConnectButton from '../../WalletConnect/ConnectButton';
import AuthContext from '../../../store/AuthStore/AuthContext';
import InvoicingRequirement from './InvoicingRequirement';
import W8Requirement from './W8Requirement';
// import FreelancerDetails from '../../User/InvoicingDetailsTab/FreelancerDetails';
// import { valueToDisplay, listWordsWithAnd } from '../../../services/utils/lib';
import KycRequirement from './KycRequirement';
import GithubRequirement from './GithubRequirement';
import ClaimButton from './ClaimButton';
import { checkClaimable, isEveryValueNotNull, isContest } from '../../../services/utils/lib';
import useIsOnCorrectNetwork from '../../../hooks/useIsOnCorrectNetwork';
import useWeb3 from '../../../hooks/useWeb3';
// import { ChevronUpIcon, ChevronDownIcon } from '@primer/octicons-react';

const ClaimPage = ({ bounty, refreshBounty, split, setInternalMenu, internalMenu, claimState, showClaimPage }) => {
  const [appState] = useContext(StoreContext);
  const [authState] = useContext(AuthContext);
  const { accountData, openQClient } = appState;
  // State
  const [justClaimed, setJustClaimed] = useState(false);
  const { account } = useWeb3();
  const [kycVerified, setKycVerified] = useState(null);
  const githubHasWalletVerifiedState = useState(null);
  const [githubHasWalletVerified] = githubHasWalletVerifiedState;
  const { status } = checkClaimable(bounty, accountData?.github, openQClient);
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();

  // TODO: ESLINT said these were given a value but never used, but they look important, so here I am writing a TODO ;-)
  // const supportingDocumentsCompleted =
  //   bounty.supportingDocumentsCompleted && bounty.supportingDocumentsCompleted[targetTier];
  // const invoiceCompleted = bounty.invoiceCompleted && bounty.invoiceCompleted[targetTier];

  const targetTier = bounty.tierWinners?.indexOf(accountData.github);
  const checkRequirementsWithGraph = (bounty) => {
    if (bounty.bountyType === '2' || bounty.bountyType === '3') {
      let w8Form = !bounty?.supportingDocumentsRequired || bounty?.supportingDocumentsCompleted?.[targetTier];
      let invoice = !bounty.invoiceRequired || bounty?.invoiceCompleted?.[targetTier];
      return { w8Form, invoice };
    } else if (bounty.bountyType === '0') {
      const w8Form = !bounty.supportingDocumentsRequired || bounty.supportingDocumentsCompleted;
      const invoice = !bounty.invoiceRequired || bounty.invoiceCompleted;
      return { w8Form, invoice };
    }
  };

  const { w8Form, invoice } = checkRequirementsWithGraph(bounty);
  let kyc = !bounty.kycRequired || kycVerified;
  let githubHasWallet = bounty.bountyType == 0 || bounty.bountyType == 1 || githubHasWalletVerified;

  const [claimable, setClaimable] = claimState;
  const canClaim = isEveryValueNotNull(claimable);
  const hasRequirements = bounty.kycRequired || bounty.supportingDocumentsRequired || bounty.invoiceRequired;

  useEffect(() => {
    setClaimable({ kyc, w8Form, githubHasWallet, invoice });
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
  /* const neededAccountData = accountKeys.filter((key) => {
    return !accountData[key];
  });
  const hasInvoicingInfo = neededAccountData.length === 0 || !bounty.invoiceRequired; */
  const showBountyClosed = status === 'Claimed';
  // Context

  // Hooks

  if (showBountyClosed) {
    return bounty.bountyType ? (
      <div className={!showClaimPage ? 'hidden' : ' w-full  lg:max-w-[800px]'}>
        <BountyClaimed bounty={bounty} justClaimed={justClaimed} />
      </div>
    ) : (
      <div className='text-lg'>Bounty type unknown. Please refresh your window.</div>
    );
  } else {
    // rewards are claimable
    return (
      <>
        <div className={`flex-1 pt-4 pb-8 w-full max-w-[1200px] ${!showClaimPage && 'hidden'}`}>
          <div className='flex flex-col w-full space-y-2 rounded-sm gap-4'>
            <div
              className={`${
                canClaim ? 'border-green bg-green-inside' : 'bg-info border-info-strong'
              } border-2 p-3 rounded-sm`}
            >
              {canClaim ? (
                'Congratulations, you can now claim your bounty!'
              ) : (
                <>
                  Congratulations, you are elgible to receive this bounty! In order to claim it you need to fulfill the
                  requirements highlighted below. To learn more read{' '}
                  <Link
                    href='https://docs.openq.dev/hackathon-winner/preparing-to-claim'
                    rel='noopener norefferer'
                    target='_blank'
                    className='underline col-span-2'
                  >
                    here
                  </Link>
                  .
                </>
              )}
            </div>
            {hasRequirements && <h3 className='flex w-full text-3xl font-semibold text-primary'>Requirements</h3>}
            {bounty.kycRequired && <KycRequirement setKycVerified={setKycVerified} />}
            {isContest(bounty) && <GithubRequirement githubHasWalletVerifiedState={githubHasWalletVerifiedState} />}
            <InvoicingRequirement bounty={bounty} setClaimable={claimState[1]} />
            {bounty.supportingDocumentsRequired && <W8Requirement bounty={bounty} />}

            <section className='flex flex-col gap-4'>
              <h4 className='flex text-2xl py-2 pt-4 md:border-b border-gray-700'>Claim Your Rewards</h4>
              {bounty.bountyType === '0' && (
                <div className='flex flex-col gap-2'>
                  <>
                    "Don't forget to add a closer comment for this bounty on your pull request :-)."
                    <CopyAddressToClipboard noClip={true} data={`Closes #${bounty.number}`} />
                  </>
                </div>
              )}{' '}
              {!authState.isAuthenticated ? (
                <div>We noticed you are not signed into Github. You must sign to verify and claim an issue!</div>
              ) : null}
              {(!account || !isOnCorrectNetwork || !accountData.github) && (
                <ConnectButton
                  needsGithub={true}
                  nav={false}
                  tooltipAction={'claim this contract!'}
                  hideSignOut={true}
                />
              )}
              <ClaimButton
                claimable={claimable}
                bounty={bounty}
                tooltipStyle={'-left-2'}
                refreshBounty={refreshBounty}
                setInternalMenu={setInternalMenu}
                internalMenu={internalMenu}
                split={split}
                setJustClaimed={setJustClaimed}
              />
            </section>

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
          </div>
        </div>
      </>
    );
  }
};

export default ClaimPage;
