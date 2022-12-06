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
import useAuth from '../../hooks/useAuth';
import StoreContext from '../../store/Store/StoreContext';
import Logger from '../../services/logger/Logger';

const userId = ({ userId, user, organizations, renderError }) => {
  const [authState] = useAuth();
  const { signedAccount } = authState;
  const [appState] = useContext(StoreContext);
  const [starredOrganizations, setStarredOrganizations] = useState([]);
  const [watchedBounties, setwatchedBounties] = useState([]);

  const [publicPrivateUserData, setPublicPrivateUserData] = useState(user);

  useEffect(() => {
    const getOffChainData = async () => {
      let privateUserData;
      try {
        privateUserData = await appState.openQPrismaClient.getUser(ethers.utils.getAddress(userId));
        setPublicPrivateUserData({ ...user, ...privateUserData });
      } catch (error) {
        appState.logger.info('Viewing user not owner');
      }
      let starredOrganizations = [];
      setwatchedBounties(privateUserData?.watchedBounties.nodes);
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
      } catch (err) {
        appState.logger.error(err);
      }
    };
    getOffChainData();
  }, []);
  return (
    <div className=' gap-4 justify-center pt-6'>
      {user ? (
        <AboutFreelancer
          showWatched={userId === signedAccount}
          starredOrganizations={starredOrganizations}
          watchedBounties={watchedBounties}
          user={publicPrivateUserData}
          account={userId}
          organizations={organizations}
        />
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
  githubRepository.instance.setGraphqlHeaders(oauthToken);

  let userId = context.params.userId;
  let renderError = '';

  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  
	let user = {
    bountiesClosed: [],
    bountiesCreated: [],
    deposits: [],
    fundedTokenBalances: [],
    id: userId,
    payoutTokenBalances: [],
    payouts: [],
    renderError,
  };

  let organizations = [];
  let starredOrganizations = [];
  let userOffChainData = {};
  
	try {
		// 1. We fetch the API user using the userId we get from the URL
    userOffChainData = await openQPrismaClient.instance.getPublicUserById(userId);
  } catch (err) {
    logger.error(err);
  }

  try {
		// 2. We fetch the on-chain user address if they have registered using the externalUserId (AKA githubId)
		// userOnChainData.id is the address of the user
    const userOnChainData = await openQSubgraphClient.instance.getUserByGithubId(userOffChainData.github);
		try {
			let provider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_PROJECT_ID);
	
			// 3. We use the address to resolve the ENS name
			userId = await provider.resolveName(userOnChainData.id);
			// we need to check if their address is reverse registered
		} catch (err) {
			logger.error(err);
		}

    // 4. This is throwing an error...
    try {
      const issueIds = userOnChainData.bountiesClosed.map((bounty) => bounty.bountyId);
      organizations = await githubRepository.instance.parseOrgIssues(issueIds);
    } catch (err) {
      console.error('could not fetch organizations');
    }
    user = { ...user, ...userOnChainData, ...userOffChainData };
  } catch (err) {
    logger.error(err);
  }

  return {
    props: { userId, user, organizations, renderError, starredOrganizations, oauthToken },
  };
};

export default userId;
