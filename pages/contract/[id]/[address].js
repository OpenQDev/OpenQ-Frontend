// Third party
import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ethers } from 'ethers';
import useWeb3 from '../../../hooks/useWeb3';
import Link from 'next/link';
import ReactGA from 'react-ga4';
import nookies from 'nookies';

// Custom
import StoreContext from '../../../store/Store/StoreContext';
import BountyCardDetails from '../../../components/Bounty/BountyCardDetails';
import FundPage from '../../../components/FundBounty/FundPage';
import dynamic from 'next/dynamic';
const RefundPage = dynamic(() => import('../../../components/RefundBounty/RefundPage'), { ssr: false });
import ClaimPage from '../../../components/Claim/ClaimPage';
import AdminPage from '../../../components/Admin/AdminPage';
import useGetTokenValues from '../../../hooks/useGetTokenValues';
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import Logger from '../../../services/logger/Logger';
import useAuth from '../../../hooks/useAuth';
import RepoTitle from '../../../components/Bounty/RepoTitle';
import SubMenu from '../../../components/Utils/SubMenu';
import BountyHeading from '../../../components/Bounty/BountyHeading';
import BountyMetadata from '../../../components/Bounty/BountyMetadata';
import Submissions from '../../../components/Submissions/Submissions';

import Add from '../../../components/svg/add';
import Subtract from '../../../components/svg/subtract';
import Fire from '../../../components/svg/fire';
import Telescope from '../../../components/svg/telescope';
import Gear from '../../../components/svg/gear';
import ClaimOverview from '../../../components/Claim/ClaimOverview';
import Log from '../../../components/svg/log';

const address = ({ address, mergedBounty, renderError }) => {
  useAuth();
  // Context
  const [appState, dispatch] = useContext(StoreContext);
  const [bounty, setBounty] = useState(mergedBounty);
  const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances);

  const createBudget = (bounty) => {
    return bounty.fundingGoalTokenAddress
      ? {
          tokenAddress: bounty.fundingGoalTokenAddress,
          volume: bounty.fundingGoalVolume,
        }
      : null;
  };
  const budgetObj = useMemo(() => createBudget(bounty), [bounty]);
  const [budgetValues] = useGetTokenValues(budgetObj);
  const budget = budgetValues?.total;
  const { account } = useWeb3();

  const createRewardSplit = (bounty) => {
    return bounty.payoutTokenVolume
      ? {
          tokenAddress: bounty.payoutTokenAddress,
          volume: bounty.payoutTokenVolume,
        }
      : null;
  };
  const splitObj = useMemo(() => createRewardSplit(bounty), [bounty]);
  const [splitValue] = useGetTokenValues(splitObj);
  const split = splitValue?.total;

  // State
  const [error, setError] = useState(renderError);
  const [internalMenu, setInternalMenu] = useState();
  const [justMinted, setJustMinted] = useState();

  // Refs
  const canvas = useRef();

  // Methods
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

  // Close Bounty: Change in bounty.status
  // Group Fund/Refund/Extend Deposit in "JSON.stringify(newBounty.deposits) === JSON.stringify(bounty.deposits)" comparison
  // Fund: Change in deposits length
  // Refund: Check that one of the deposits has been refunded
  // Extend Deposit: Change in deposit expiration
  // Claim: change in payouts
  // No faster than 1 second so begin with a sleep so as to not spam the Graph Hosted Service
  const refreshBounty = async () => {
    await sleep(1000);
    let newBounty = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
    try {
      while (
        newBounty.status === bounty.status &&
        JSON.stringify(newBounty.deposits) === JSON.stringify(bounty.deposits) &&
        newBounty.fundingGoalVolume === bounty.fundingGoalVolume &&
        newBounty.payoutTokenVolume === bounty.payoutTokenVolume &&
        newBounty.payoutSchedule === bounty.payoutSchedule &&
        newBounty.payouts === bounty.payouts
      ) {
        newBounty = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
        await sleep(500);
      }
      const mergedBounty = { ...bounty, ...newBounty };
      setBounty(mergedBounty);
      setReload();
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    if (internalMenu) {
      sessionStorage.setItem(address, internalMenu);
    }
  }, [internalMenu]);

  useEffect(() => {
    if (bounty && bounty.issuer?.id && ethers.utils.getAddress(bounty.issuer.id) !== account) {
      setInternalMenu('View');
    }
  }, [account]);

  // Hooks
  useEffect(() => {
    const bountyTypeName = appState.utils.getBountyTypeName(bounty);
    ReactGA.event(
      {
        category: bountyTypeName,
        name: 'VIEW_BOUNTY',
        action: 'VIEW_BOUNTY',
        dimension: JSON.stringify({
          bountyType: bountyTypeName,
          [bounty.address]: 'OPEN_MODAL',
        }),
        label: 'address:'.concat(bounty.address),
      },
      []
    );
    const handleResize = () => {
      try {
        if (canvas.current?.width) {
          canvas.current.width = window.innerWidth;
          canvas.current.height = window.innerHeight;
        }
      } catch (err) {
        appState.logger.error(err, account);
      }
    };
    window.addEventListener('resize', handleResize, false);
    // Confetti
    const justMinted = sessionStorage.getItem('justMinted') === 'true';
    if (justMinted && canvas.current) {
      setJustMinted(true);
      refreshBounty();
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
      sessionStorage.setItem('justMinted', false);
    }
    // set route and populate
    if (address) {
      const route = sessionStorage.getItem(address);

      if (route !== internalMenu) {
        setInternalMenu(route || 'View');
      }
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const claimOverView = bounty?.claims?.length > 0 ? [{ name: 'Claims Overview', Svg: Log }] : [];
  const submissions =
    bounty.bountyType === '2' || bounty.bountyType === '3' ? [{ name: 'Submissions', Svg: Gear }] : [];
  const claim = bounty.bountyType === '0' || bounty.bountyType === '1' ? [{ name: 'Claim', Svg: Fire }] : [];
  // User Methods

  // Render
  if (error) {
    return <UnexpectedErrorModal error={error} />;
  } else
    return (
      <>
        {!mergedBounty ? (
          <div
            className='flex fixed inset-0 mx-20 justify-center items-center 
	 h-screen'
          >
            <div className='text-2xl'>
              Bounty not found.{' '}
              <span className='underline'>
                <Link href={'/'}>
                  <span>Go home</span>
                </Link>
              </span>
              .
            </div>
          </div>
        ) : (
          <>
            <div className='flex flex-col justify-center items-center pt-4'>
              <RepoTitle bounty={bounty} />
              <SubMenu
                colour='rust'
                items={[
                  { name: 'View', Svg: Telescope },
                  { name: 'Fund', Svg: Add },
                  { name: 'Refund', Svg: Subtract },
                  ...claim,
                  ...submissions,
                  ...claimOverView,
                  {
                    name: bounty.issuer && ethers.utils.getAddress(bounty?.issuer?.id) == account ? 'Admin' : null,
                    Svg: bounty.issuer && ethers.utils.getAddress(bounty.issuer.id) == account ? Gear : null,
                  },
                ]}
                internalMenu={internalMenu}
                updatePage={setInternalMenu}
              />

              <BountyHeading price={tokenValues?.total} budget={budget} bounty={bounty} />

              <div className='flex justify-between  w-full px-2 sm:px-8 flex-wrap max-w-[1200px] pb-8 mx-auto'>
                {internalMenu == 'View' && (
                  <BountyCardDetails
                    justMinted={justMinted}
                    budgetValues={budgetValues}
                    split={split}
                    bounty={bounty}
                    setInternalMenu={setInternalMenu}
                    address={address}
                    tokenValues={tokenValues}
                    internalMenu={internalMenu}
                  />
                )}
                {internalMenu == 'Fund' && bounty ? (
                  <FundPage
                    bounty={bounty}
                    refreshBounty={refreshBounty}
                    price={tokenValues?.total}
                    budget={budget}
                    split={split}
                  />
                ) : null}
                {internalMenu == 'Claim' && bounty ? (
                  <ClaimPage price={tokenValues?.total} split={split} bounty={bounty} refreshBounty={refreshBounty} />
                ) : null}
                {internalMenu == 'Claims Overview' && bounty ? (
                  <ClaimOverview bounty={bounty} setInternalMenu={setInternalMenu} />
                ) : null}
                {internalMenu == 'Admin' &&
                bounty &&
                bounty?.issuer?.id &&
                ethers.utils.getAddress(bounty.issuer.id) == account ? (
                  <AdminPage
                    bounty={bounty}
                    refreshBounty={refreshBounty}
                    price={tokenValues?.total}
                    budget={budget}
                    split={split}
                  />
                ) : null}
                {internalMenu == 'Submissions' && bounty?.payoutSchedule ? (
                  <Submissions refreshBounty={refreshBounty} bounty={bounty} />
                ) : null}
                {bounty && <RefundPage bounty={bounty} refreshBounty={refreshBounty} internalMenu={internalMenu} />}

                {internalMenu && internalMenu !== 'Submissions' && (
                  <BountyMetadata
                    price={tokenValues?.total}
                    budget={budget}
                    split={split}
                    bounty={bounty}
                    setInternalMenu={setInternalMenu}
                  />
                )}
              </div>
              <canvas className='absolute w-full top-0 z-40 bottom-0 pointer-events-none' ref={canvas}></canvas>
            </div>
          </>
        )}
      </>
    );
};

export const getServerSideProps = async (context) => {
  const githubRepository = new WrappedGithubClient();
  const cookies = nookies.get(context);
  const { github_oauth_token_unsigned } = cookies;
  const oauthToken = github_oauth_token_unsigned ? github_oauth_token_unsigned : null;
  githubRepository.instance.setGraphqlHeaders(oauthToken);

  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  githubRepository.instance.setGraphqlHeaders();
  const logger = new Logger();
  const { id, address } = context.query;
  let bountyMetadata = {};
  let renderError = '';
  try {
    bountyMetadata = await openQPrismaClient.instance.getBounty(ethers.utils.getAddress(address));
  } catch (err) {
    logger.error(err);
  }
  let mergedBounty = null;
  let issueData = {};
  let bounty = {};
  try {
    issueData = await githubRepository.instance.fetchIssueById(id);
  } catch (err) {
    logger.error(err);
    renderError = 'OpenQ could not find the issue connected to this to contract on Github.';
  }
  try {
    bounty = await openQSubgraphClient.instance.getBounty(address, 'no-cache');
    if (!bounty) {
      logger.error({ message: `OpenQ could not find a contract with address: ${address}.` });
    }
    mergedBounty = {
      ...issueData,
      ...bountyMetadata,
      ...bounty,
      bountyAddress: address,
    };
  } catch (err) {
    logger.error(err);
    renderError = `OpenQ could not find a contract with address: ${address}.`;
  }
  return { props: { id, address, mergedBounty, renderError, oauthToken } };
};

export default address;
