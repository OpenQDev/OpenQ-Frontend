// Third party Libraries
import React, { useState, useRef, useContext } from 'react';
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
import { /*ChevronDownIcon, ChevronUpIcon,*/ MailIcon } from '@primer/octicons-react';
//import FreelancerDetails from '../../User/InvoicingDetailsTab/FreelancerDetails';
//import { valueToDisplay, listWordsWithAnd } from '../../../services/utils/lib';

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
        <div className='flex-1 pt-4 pb-8 w-full max-w-[1200px] justify-center'>
          <div className='flex flex-col w-full space-y-2 rounded-sm gap-4'>
            <div className='bg-info border-info-strong border p-4 rounded-sm'>
              Congratulations, you are elgible to receive this bounty! in order to claim it you need to fulfill the
              requriements highlighted below. To learn more read <span>here.</span>
            </div>
            <h3 className='justify-self-start text-2xl font-semibold'>Requirements</h3>

            {bounty.invoiceable && (
              <section className='flex flex-col gap-3'>
                <h4 className='text-2xl'>
                  <div className='flex content-center items-center gap-2 border-b border-web-gray pb-2'>
                    Invoice
                    <div className='bg-info border border-bg-info-strong text-sm px-2 rounded-full h-6'>Required</div>
                  </div>
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
                <button
                  onClick={handleSendInvoice}
                  className='flex gap-2 justify-center items-center content-center w-20 px-4 py-0.5 bg-claim rounded-sm'
                >
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
            {bounty.bountyType === '0' && (
              <>
                "Don't forget to add a closer comment for this bounty on your pull request :-)."
                <CopyAddressToClipboard noClip={true} data={`Closes #${bounty.number}`} />
              </>
            )}
            {!authState.isAuthenticated ? (
              <div className=' col-span-3 border border-gray-700 bg-[#21262d] rounded-sm p-4'>
                We noticed you are not signed into Github. You must sign to verify and claim an issue!
              </div>
            ) : null}
            <ConnectButton needsGithub={true} nav={false} tooltipAction={'claim this contract!'} hideSignOut={true} />
            {account && isOnCorrectNetwork && authState.isAuthenticated && (
              <div className='flex flex-col space-y-5'>
                <ToolTipNew
                  groupStyles={'w-full'}
                  outerStyles='flex w-full items-center'
                  hideToolTip={price > 0 && hasInvoicingInfo}
                  toolTipText={
                    price <= 0
                      ? 'There are no funds locked to claim, contact the maintainer of this issue.'
                      : !hasInvoicingInfo && 'This bounty requires invoicing data, please fill in the form below.'
                  }
                >
                  <button
                    type='submit'
                    className={
                      price > 0 && hasInvoicingInfo
                        ? 'btn-primary cursor-pointer w-full px-8 whitespace-nowrap py-0.5'
                        : 'btn-default cursor-not-allowed w-full  px-8 whitespace-nowrap py-0.5'
                    }
                    disabled={!(price > 0 && hasInvoicingInfo)}
                    onClick={() => setShowClaimLoadingModal(true)}
                  >
                    Claim
                  </button>
                </ToolTipNew>
              </div>
            )}
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
