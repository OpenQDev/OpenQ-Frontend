import { FeedTrophyIcon } from '@primer/octicons-react';
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import useIsOnCorrectNetwork from '../../../../hooks/useIsOnCorrectNetwork';
import useWeb3 from '../../../../hooks/useWeb3';
import AuthContext from '../../../../store/AuthStore/AuthContext';
import StoreContext from '../../../../store/Store/StoreContext';
import ToolTipNew from '../../../Utils/ToolTipNew';
import ClaimLoadingModal from '../../ClaimLoadingModal';
import {
  CHECKING_WITHDRAWAL_ELIGIBILITY,
  WITHDRAWAL_INELIGIBLE,
  TRANSACTION_SUBMITTED,
  TRANSACTION_CONFIRMED,
  CONFIRM_CLAIM,
} from '../../ClaimStates.js';
import useDisplayValue from '../../../../hooks/useDisplayValue';
import { isContest, isEveryValueNotNull } from '../../../../services/utils/lib';

const ClaimButton = ({
  bounty,
  tooltipStyle,
  refreshBounty,
  setInternalMenu,
  internalMenu,
  split,
  setJustClaimed,
  claimable,
  bountyHeading,
}) => {
  const { url } = bounty;
  const { account, library } = useWeb3();
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [appState, dispatch] = useContext(StoreContext);
  const [claimState, setClaimState] = useState(CONFIRM_CLAIM);
  const [transactionHash, setTransactionHash] = useState(null);
  const [error, setError] = useState('');
  const { logger } = appState;
  const [authState] = useContext(AuthContext);

  const { accountData } = appState;
  const [showClaimLoadingModal, setShowClaimLoadingModal] = useState(false);

  const budgetValues = useDisplayValue(bounty, appState.utils.formatter.format, 'budget');
  const budget = budgetValues?.value;
  const actualValues = useDisplayValue(bounty, appState.utils.formatter.format, 'actual');
  const price = actualValues?.value;
  // TODO refine fuzzy solvency
  const isSolvent = price >= budget - 1 && price > 0;
  const canClaim = isEveryValueNotNull(claimable);

  const getRequiredText = (claimable) => {
    let kyc, w8Form, githubHasWallet, invoice;
    kyc = claimable?.kyc ?? null;
    w8Form = claimable?.w8Form ?? null;
    githubHasWallet = claimable?.githubHasWallet ?? null;
    invoice = claimable?.invoice ?? null;
    switch (null) {
      case githubHasWallet:
        return 'You must first associate a wallet to your GitHub account to claim this bounty.';
      case kyc:
        return 'You must complete KYC to claim this bounty.';
      case w8Form:
        return 'You must complete a W8/W9 form to claim this bounty.';
      case invoice:
        return 'You must complete an invoice to claim this bounty.';
      default:
        return '';
    }
  };
  const claimValuesRequiredText = getRequiredText(claimable);

  const targetTier = bounty.tierWinners?.indexOf(accountData.github);
  const claimValueTier =
    bounty.bountyType !== '0'
      ? { tokenAddress: bounty.payoutTokenAddress, volume: bounty.payoutSchedule?.[targetTier] }
      : {};

  const canvas = useRef();

  const updateModal = () => {
    setShowClaimLoadingModal(false);
    if (claimState === TRANSACTION_CONFIRMED) {
      refreshBounty();
    } else {
      setClaimState(CONFIRM_CLAIM);
    }
  };
  const claimBounty = async () => {
    setClaimState(CHECKING_WITHDRAWAL_ELIGIBILITY);
    const promise = new Promise(async (resolve, reject) => {
      try {
        if ((bounty.bountyType === '2') | (bounty.bountyType === '3')) {
          // TODO Re-add the actual code for PRs here IF we continue to use PRs for submissions
          // Unsure if an empty string will work here, using a placeholder for now
          const prUrl = 'https://github.com/SporkDAOOfficial/ETHDenver-2023/pull/456';
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
          resolve(result.transactionHash);
        } else {
          const result = await axios.post(
            `${process.env.NEXT_PUBLIC_ORACLE_URL}/claim`,
            {
              issueUrl: url,
              payoutAddress: account,
            },
            { withCredentials: true }
          );
          resolve(result.data.txnHash);
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
      setJustClaimed && setJustClaimed(true);

      const payload = {
        type: 'UPDATE_RELOAD',
        payload: true,
      };

      dispatch(payload);
    } catch (err) {
      if (isContest(bounty)) {
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
          message: err?.response?.data?.errorMessage || 'Error claiming bounty',
          title: 'Error',
          referencedPrs: err?.response?.data?.referencedPrs || [],
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
          hideToolTip={isSolvent && canClaim}
          toolTipText={
            isSolvent
              ? claimValuesRequiredText
              : 'There are not enough funds locked to claim, contact the maintainer of this issue.'
          }
        >
          <button
            type='submit'
            className={`h-8 ${
              isSolvent && canClaim
                ? 'btn-primary bg-green cursor-pointer w-fit'
                : internalMenu == 'Claim' || !bountyHeading
                ? 'btn-default cursor-not-allowed'
                : 'btn-default'
            }
                `}
            disabled={!(isSolvent && canClaim) && !bountyHeading}
            onClick={
              bountyHeading && internalMenu !== 'Claim'
                ? () => setInternalMenu('Claim')
                : () => setShowClaimLoadingModal(true)
            }
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
          split={split}
          account={account}
          transactionHash={transactionHash}
          setShowClaimLoadingModal={updateModal}
          claimValueTier={claimValueTier}
          error={error}
          claimState={claimState}
          bounty={bounty}
          authState={authState}
          price={price}
        />
      )}
      <canvas className='absolute inset-0 pointer-events-none' ref={canvas}></canvas>
    </>
  );
};

export default ClaimButton;
