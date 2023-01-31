import { FeedTrophyIcon } from '@primer/octicons-react';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import useDisplayValue from '../../../../hooks/useDisplayValue';
import useIsOnCorrectNetwork from '../../../../hooks/useIsOnCorrectNetwork';
import useWeb3 from '../../../../hooks/useWeb3';
import AuthContext from '../../../../store/AuthStore/AuthContext';
import StoreContext from '../../../../store/Store/StoreContext';
import ToolTipNew from '../../../Utils/ToolTipNew';
import ClaimLoadingModal from '../../ClaimLoadingModal';
import confetti from 'canvas-confetti';
import {
  CHECKING_WITHDRAWAL_ELIGIBILITY,
  WITHDRAWAL_INELIGIBLE,
  TRANSACTION_SUBMITTED,
  TRANSACTION_CONFIRMED,
  CONFIRM_CLAIM,
} from '../../ClaimStates.js';
import useEns from '../../../../hooks/useENS';

const ClaimButton = ({ bounty, tooltipStyle, refreshBounty, setInternalMenu, split }) => {
  const { url } = bounty;
  const { account, library } = useWeb3();
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [appState, dispatch] = useContext(StoreContext);
  const [claimState, setClaimState] = useState(CONFIRM_CLAIM);
  const [transactionHash, setTransactionHash] = useState(null);
  const [error, setError] = useState('');
  const [ensName] = useEns(account);
  const { logger } = appState;
  const [authState] = useContext(AuthContext);

  const [associatedAddress, setAssociatedAddress] = useState(null);
  const [kycVerified, setKycVerified] = useState(null);
  const { accountData } = appState;
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const actualValues = useDisplayValue(bounty, appState.utils.formatter.format, 'actual');
  const price = actualValues?.displayValue;
  const [showClaimLoadingModal, setShowClaimLoadingModal] = useState(false);

  const supportingDocumentsCompleted =
    bounty.supportingDocumentsCompleted && bounty.supportingDocumentsCompleted[targetTier];
  const invoiceCompleted = bounty.invoiceCompleted && bounty.invoiceCompleted[targetTier];

  const targetTier = bounty.tierWinners.indexOf(accountData.github);

  const checkRequirementsWithGraph = (bounty) => {
    if (bounty.bountyType === '2' || bounty.bountyType === '3') {
      let w8Form = !bounty.supportingDocumentsRequired || supportingDocumentsCompleted;
      let invoice = !bounty.invoiceRequired || invoiceCompleted;
      return { w8Form, invoice };
    } else return {};
  };

  const { w8Form, invoice } = checkRequirementsWithGraph(bounty);
  let kyc = !bounty.kycRequired || kycVerified;
  let githubHasWallet = bounty.bountyType == 0 || bounty.bountyType == 1 || associatedAddress;
  let claimable = kyc && w8Form && githubHasWallet && invoice;

  const canvas = useRef();

  useEffect(() => {
    hasKYC();
  }, []);

  useEffect(() => {
    claimable = kyc && w8Form && githubHasWallet && invoice;
  }, [kyc, w8Form, githubHasWallet, invoice]);

  useEffect(() => {
    const checkAssociatedAddress = async () => {
      if (library && account && authState.githubId) {
        try {
          const associatedAddress = await appState.openQClient.getAddressById(library, authState.githubId);
          if (associatedAddress !== zeroAddress) {
            setAssociatedAddress(associatedAddress);
          }
        } catch (err) {
          appState.logger.error(err, accountData.id, 'GithubConnection.js1');
        }
      }
    };
    checkAssociatedAddress();
  }, [library, account, authState.githubId]);

  const hasKYC = async () => {
    try {
      const transaction = await appState.openQClient.hasKYC(library, account);
      if (transaction) {
        setKycVerified(true);
      }
    } catch (err) {
      appState.logger.error(err, account, 'KycRequirement.js1');
    }
  };

  const updateModal = () => {
    setShowClaimLoadingModal(false);
    if (claimState === TRANSACTION_CONFIRMED) {
      refreshBounty();
      setInternalMenu('Claims Overview');
    } else {
      setClaimState(CONFIRM_CLAIM);
    }
  };

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
      if (bounty.bountyType === '2' || bounty.bountyType === '3') {
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

  return (
    <>
      {account && isOnCorrectNetwork && authState.isAuthenticated && (
        <ToolTipNew
          relativePosition={tooltipStyle}
          triangleStyles={'left-3'}
          outerStyles={'relative bottom-1'}
          hideToolTip={price > 0 && claimable}
          toolTipText={
            price <= 0 || !price
              ? 'There are not enough funds locked to claim, contact the maintainer of this issue.'
              : 'Please first go through all the required steps before you can claim your rewards.'
          }
        >
          <button
            type='submit'
            className={price > 0 && claimable ? 'btn-primary cursor-pointer w-fit' : 'btn-default cursor-not-allowed'}
            disabled={!(price > 0 && claimable)}
            onClick={() => setShowClaimLoadingModal(true)}
          >
            <div className='flex gap-2 items-center'>
              {' '}
              <FeedTrophyIcon />
              Claim
            </div>
          </button>
        </ToolTipNew>
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
    </>
  );
};

export default ClaimButton;
