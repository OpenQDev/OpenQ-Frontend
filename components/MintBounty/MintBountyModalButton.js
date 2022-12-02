import React, { useContext } from 'react';

import { useRouter } from 'next/router';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import ToolTipNew from '../Utils/ToolTipNew';
import ConnectButton from '../WalletConnect/ConnectButton';
import MintContext from './MintContext';

// TODO: Put all this state logic into a context, and possibly add a reducer
const MintBountyModalButton = ({
  enableMint,
  isLoadngState,
  issue,

  currentSum,
  sum,
  category,
  enableRegistrationState,
  registrationDeadlineState,
  startDateState,
  payoutTokenState,

  payoutVolumeState,
  finalTierVolumesState,
  modalVisibility,
  setError,
}) => {
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const enableContest = category === 'Contest' ? sum == 100 : true;
  console.log(enableContest, enableMint);

  const [finalTierVolumes] = finalTierVolumesState;
  const [payoutToken] = payoutTokenState;
  const [payoutVolume] = payoutVolumeState;
  const [enableRegistration] = enableRegistrationState;
  const [registrationDeadline] = registrationDeadlineState;
  const [startDate] = startDateState;
  const [isLoading, setIsLoading] = isLoadngState;
  const [mintState] = useContext(MintContext);

  const { goalToken, goalVolume } = mintState;

  const [appState, dispatch] = useContext(StoreContext);
  const { account, library, safe } = useWeb3();
  const router = useRouter();
  const readyToMint = enableMint && !issue?.closed && issue?.url.includes('/issues/') && !isLoading && enableContest;
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
      setIsLoading(true);
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
        category,
        data
      );
      if (enableRegistration) {
        await appState.openQPrismaClient.setIsContest({
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
      await router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/contract/${issue.id}/${bountyAddress.toLowerCase()}`);
      if (modalVisibility && safe) {
        modalVisibility(false);
      }
    } catch (error) {
      const { message, title } = appState.openQClient.handleError(error);
      appState.logger.error(message, account);
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
          hideToolTip={readyToMint}
          toolTipText={
            issue?.closed && issue?.url?.includes('/issues/')
              ? 'Issue closed'
              : !enableMint || !issue?.url?.includes('/issues/')
              ? 'Please choose an elgible issue.'
              : currentSum !== sum
              ? 'Please make sure each tier gets a percentage.'
              : !enableContest
              ? 'Please make sure the sum of tier percentages adds up to 100.'
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
