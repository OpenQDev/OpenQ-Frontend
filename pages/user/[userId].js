// Third party
import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import nookies from 'nookies';

// Custom
import AboutFreelancer from '../../components/User/AboutFreelancer';
import UnexpectedErrorModal from '../../components/Utils/UnexpectedErrorModal';
import WrappedGithubClient from '../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import StoreContext from '../../store/Store/StoreContext';
import Logger from '../../services/logger/Logger';
import FirstSignupModal from '../../components/Authentication/FirstSignupModal';
import AuthContext from '../../store/AuthStore/AuthContext';

const userId = ({ user, organizations, renderError }) => {
  const [authState, dispatch] = useContext(AuthContext);
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const [starredOrganizations, setStarredOrganizations] = useState([]);
  const [watchedBounties, setWatchedBounties] = useState([]);
  const [firstSignupModal, setFirstSignupModal] = useState(authState.isNewUser);
  console.log(authState);

  const [publicPrivateUserData] = useState(user);

  useEffect(() => {
    const getOffChainData = async () => {
      let starredOrganizations = [];
      setWatchedBounties(user?.watchedBounties?.nodes);
      //get starred organizations.
      try {
        if (user.starredOrganizationIds) {
          const subgraphOrgs = await appState.openQSubgraphClient.getOrganizationsByIds(user.starredOrganizationIds);
          const githubOrgIds = subgraphOrgs.map((bounty) => bounty.id);
          const githubOrganizations = await appState.githubRepository.fetchOrganizationsByIds(githubOrgIds);
          starredOrganizations = githubOrganizations.map((organization) => {
            const subgraphOrg = subgraphOrgs.find((org) => {
              return org.id === organization.id;
            });

            return { ...organization, ...subgraphOrg, starred: true };
          });
          setStarredOrganizations(starredOrganizations);
        }
      } catch (error) {
        appState.logger.error(error, accountData.id, '[userId.js]1');
      }
    };
    getOffChainData();
  }, []);

  async function closeModal() {
    setFirstSignupModal(false);
    const newUserDispatch = {
      type: 'IS_NEW_USER',
      payload: false,
    };
    await dispatch(newUserDispatch);
  }

  console.log(authState);

  return (
    <div className=' gap-4 justify-center pt-6'>
      {user?.id ? (
        <>
          {authState?.isAuthenticated && firstSignupModal && (
            <FirstSignupModal closeModal={closeModal} setShowModal={setFirstSignupModal} />
          )}
          <AboutFreelancer
            starredOrganizations={starredOrganizations}
            watchedBounties={watchedBounties}
            user={publicPrivateUserData}
            userId={user.id}
            organizations={organizations}
          />
        </>
      ) : (
        <UnexpectedErrorModal error={renderError} />
      )}
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const githubRepository = new WrappedGithubClient();
  const cookies = nookies.get(context);
  const { github_oauth_token_unsigned } = cookies;
  const logger = new Logger();
  const oauthToken = github_oauth_token_unsigned ? github_oauth_token_unsigned : null;
  const emailAuth = true; // ?
  githubRepository.instance.setGraphqlHeaders(oauthToken);
  let userId = context.params.userId;
  let renderError = '';

  const openQPrismaClient = new WrappedOpenQPrismaClient();
  openQPrismaClient.instance.setGraphqlHeaders(oauthToken);

  const openQSubgraphClient = new WrappedOpenQSubgraphClient();

  let user = {
    bountiesClosed: [],
    bountiesCreated: [],
    deposits: [],
    fundedTokenBalances: [],
    id: userId,
    payoutTokenBalances: [],
    payouts: [],
    renderError,
    avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4',
  };

  let organizations = [];
  let starredOrganizations = [];
  let userOffChainData = {};
  let userGithubData = {};
  let userOnChainData = {};

  try {
    // 1. We fetch the API user using the userId we get from the URL
    if (emailAuth) {
      userOffChainData = await openQPrismaClient.instance.getPublicUserById(userId);
    } else {
      userOffChainData = await openQPrismaClient.instance.getUser(userId);
    }
    if (!userOffChainData) {
      // This is where we should throw a 404
      return { props: { renderError: `User with id ${userId} not found.` } };
    }
  } catch (error) {
    logger.error(error, null, '[userId.js]2');
  }

  let privateUserData;
  try {
    privateUserData = await openQPrismaClient.instance.getUser({ id: userOffChainData.id });
  } catch (error) {
    logger.error(error, null, '[userId.js]3');
  }

  const userHasAssociatedGithub = userOffChainData.github;
  if (userHasAssociatedGithub) {
    try {
      // 2. We fetch the Github user using the userId we get from the URL (IF IT'S A GITHUB USER!)
      userGithubData = await githubRepository.instance.fetchUserById(userOffChainData.github);
    } catch (error) {
      logger.error(error, null, '[userId.js]4');
      const stringifiedErr = JSON.stringify(error);
      if (stringifiedErr.includes('401')) {
        return { props: { renderError: stringifiedErr } };
      }
      return { props: { renderError: `${userOffChainData.github} is not a valid GitHub ID.` } };
    }

    try {
      // 3. We fetch the on-chain user address if they have registered using the externalUserId (AKA githubId)
      // userOnChainData.id is the address of the user
      userOnChainData = await openQSubgraphClient.instance.getUserByGithubId(userOffChainData.github);
      try {
        let provider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_PROJECT_ID);

        // 4. We use the address to resolve the ENS name
        userId = await provider.resolveName(userOnChainData.id);
      } catch (error) {
        logger.error(error, null, '[userId.js]5');
      }

      // 5. If user closed issues, get relevant issueIds and organizations
      try {
        const issueIds = userOnChainData.bountiesClosed?.map((bounty) => bounty.bountyId);
        if (issueIds) organizations = await githubRepository.instance.parseOrgIssues(issueIds);
      } catch (err) {
        logger.error({ mesage: 'could not fetch organizations' }, null, '[userId.js]6');
      }
      // NOTE: The order of the spread is important here. We want to override the Github user avatarUrl with the one from the database
      // For email users, they get an auto-assigned anonymous profile picture for email
      // For Github users, we want to default to their Github profile picture
      // For other users, they may want to set their own profile picture in the database
    } catch (err) {
      logger.error({ mesage: 'could not fetch organizations' }, null, '[userId.js]7');
    }
  }

  user = {
    ...user,
    ...userGithubData,
    ...userOnChainData,
    onChainAddress: userOnChainData?.id || null,
    ...userOffChainData,
    ...privateUserData,
  };

  return {
    props: { user, organizations, renderError, starredOrganizations, oauthToken },
  };
};

export default userId;
