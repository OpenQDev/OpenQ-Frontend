import React, { useContext } from 'react';

import { useRouter } from 'next/router';
import useIsOnCorrectNetwork from '../../../hooks/useIsOnCorrectNetwork';
import useWeb3 from '../../../hooks/useWeb3';
import StoreContext from '../../../store/Store/StoreContext';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import ToolTipNew from '../../Utils/ToolTipNew';
import ConnectButton from '../../WalletConnect/ConnectButton';
import MintContext from '../MintContext';
import { checkHackathonDates } from '../../../services/utils/lib';

// TODO: Put all this state logic into a context, and possibly add a reducer
const MintBountyModalButton = ({ modalVisibility, setError }) => {
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [mintState, mintDispatch] = useContext(MintContext);

  const {
    goalToken,
    goalVolume,
    registrationDeadline,
    startDate,
    enableRegistration,
    category,
    payoutToken,
    payoutVolume,
    finalTierVolumes,
    isLoading,
    issue,
    enableMint,
    invoiceable,
    kycRequired,
    supportingDocumentsRequired,
    altName,
    altUrl,
  } = mintState;
  const sum = finalTierVolumes.length ? finalTierVolumes.reduce((a, b) => a + b) : 0;

  const enableContest = category === 'Contest' ? sum == 100 : true;
  const [appState, dispatch] = useContext(StoreContext);
  const datesCheck = checkHackathonDates(startDate, registrationDeadline, new Date());
  const { accountData } = appState;
  const { github } = appState.accountData;
  const { account, library, safe } = useWeb3();
  const router = useRouter();
  const hasRequirements = invoiceable || kycRequired || supportingDocumentsRequired;
  const loggedInIfNeeded = accountData.id || !hasRequirements;
  const readyToMint =
    enableMint &&
    !issue?.closed &&
    issue?.url.includes('/issues/') &&
    !isLoading &&
    enableContest &&
    datesCheck &&
    loggedInIfNeeded;
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const setReload = () => {
    const payload = {
      type: 'UPDATE_RELOAD',
      payload: true,
    };
    dispatch(payload);
  };

  const refreshBounty = async (address) => {
    await sleep(1000);
    const payload = { type: 'BOUNTY_MINTED', payload: address };
    dispatch(payload);
    let newBounty = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
    try {
      while (!newBounty) {
        newBounty = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
        await sleep(500);
      }
      await sleep(180000); // forcing 3 min waiting time since the new bounty still not visible in list
      const payload = { type: 'BOUNTY_MINTED', payload: '' };
      dispatch(payload);
      setReload();
    } catch (error) {
      setError(true);
    }
  };

  const mintBounty = async () => {
    try {
      const dispatch = { type: 'SET_LOADING', payload: true };
      mintDispatch(dispatch);
      let data;
      switch (category) {
        case 'Fixed Price':
          data = {
            fundingTokenVolume: goalVolume,
            fundingTokenAddress: goalToken,
          };
          break;
        case 'Split Price':
          data = {
            payoutVolume: payoutVolume,
            payoutToken: payoutToken,
            fundingTokenVolume: goalVolume,
            fundingTokenAddress: goalToken,
          };
          break;
        case 'Contest':
          data = {
            fundingTokenVolume: goalVolume,
            fundingTokenAddress: goalToken,
            tiers: finalTierVolumes,
          };
          break;
        case 'Fixed Contest':
          data = {
            payoutToken: payoutToken,
            tiers: finalTierVolumes,
            fundingTokenVolume: goalVolume,
            fundingTokenAddress: goalToken,
          };
          break;
        default:
          throw new Error(`No type: ${category}`);
      }
      const { bountyAddress } = await appState.openQClient.mintBounty(
        library,
        issue.id,
        issue.repository.owner.id,
        accountData.id,
        category,
        invoiceable,
        kycRequired,
        supportingDocumentsRequired,
        altName,
        altUrl,
        data
      );
      if (enableRegistration && datesCheck) {
        await appState.openQPrismaClient.setIsContest({
          github,
          repositoryId: issue.repository.id,
          isContest: true,
          organizationId: issue.repository.owner.id,
          startDate,
          registrationDeadline,
        });
        //repositoryId, isContest, organizationId, startDate, registrationDeadline
      }
      sessionStorage.setItem('justMinted', true);
      refreshBounty(bountyAddress);
      await router.push(
        `${process.env.NEXT_PUBLIC_BASE_URL}/contract/${
          issue.id
        }/${bountyAddress.toLowerCase()}?invoiceable=${invoiceable}`
      );
      if (modalVisibility && safe) {
        modalVisibility(false);
      }
    } catch (error) {
      const { message, title } = appState.openQClient.handleError(error);
      appState.logger.error(error, accountData.id, 'MintBountyModalButton.js1');
      setError({ message, title });
    }
  };

  return (
    <>
      <ConnectButton nav={false} needsGithub={false} tooltipAction={'mint a contract.'} />
      {account && isOnCorrectNetwork && (
        <ToolTipNew
          outerStyles={'hover:hidden -top-20 md:top-auto'}
          triangleStyles={'mt-7 md:mt-1 rotate-180 md:rotate-0 '}
          hideToolTip={readyToMint || isLoading}
          toolTipText={
            issue?.closed && issue?.url?.includes('/issues/')
              ? 'Issue closed'
              : !enableMint || !issue?.url?.includes('/issues/')
              ? 'Please choose an elgible issue.'
              : !enableContest
              ? 'Please make sure the sum of tier percentages adds up to 100.'
              : !datesCheck
              ? 'Please make sure your Hackathon Start Date is > today and your End Date after your Start Date.'
              : !loggedInIfNeeded
              ? 'Please make sure you are logged in.'
              : null
          }
        >
          <button
            className={`${readyToMint ? 'btn-primary cursor-pointer' : 'btn-default cursor-not-allowed'}`}
            type='button'
            onClick={() => mintBounty()}
            disabled={!readyToMint}
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                Processing... <LoadingIcon bg='colored' />
              </div>
            ) : (
              'Deploy Contract'
            )}
          </button>
        </ToolTipNew>
      )}
    </>
  );
};
export default MintBountyModalButton;
