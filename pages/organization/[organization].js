// Third party
import React, { useState, useContext } from 'react';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import WrappedOpenQSubgraphClient from '../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedGithubClient from '../../services/github/WrappedGithubClient';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import Logger from '../../services/logger/Logger';
import Utils from '../../services/utils/Utils';
import useAuth from '../../hooks/useAuth';
import OrganizationHeader from '../../components/Organization/OrganizationHeader';
import SubMenu from '../../components/Utils/SubMenu';
import Home from '../../components/svg/home';
import Trophy from '../../components/svg/trophy';
import OrganizationMetadata from '../../components/Organization/OrganizationMetadata';
import OrganizationContent from '../../components/Organization/OrganizationContent';
import HackathonTab from '../../components/Organization/HackathonTab.js';

import UnexpectedErrorModal from '../../components/Utils/UnexpectedErrorModal';
import useWeb3 from '../../hooks/useWeb3';

const organization = ({ organizationData, fullBounties, batch, renderError, firstCursor }) => {
  useAuth();
  // Context
  const [appState] = useContext(StoreContext);
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [bounties, setBounties] = useState(fullBounties);
  const [pagination, setPagination] = useState(batch);
  const [offChainCursor, setOffChainCursor] = useState(firstCursor);
  const [toggleVal, setToggleVal] = useState('Overview');
  const [complete, setComplete] = useState();
  const { account } = useWeb3();
  const [error, setError] = useState(renderError);
  // Methods
  async function getBountyData(sortOrder, currentPagination, orderBy, cursor) {
    setPagination(() => currentPagination + batch);
    let complete = false;
    try {
      const [fullBounties, newCursor] = await appState.utils.fetchBounties(
        appState,
        batch,
        null,
        sortOrder,
        orderBy,
        cursor,
        organizationData.id,
        account
      );
      setOffChainCursor(newCursor);
      if (fullBounties?.length === 0) {
        complete = true;
      }
      return [fullBounties, complete];
    } catch (err) {
      setError(err);
      appState.logger.error(err, account);
      return [[], true];
    }
  }

  async function getNewData(order, orderBy) {
    setIsLoading(true);
    setComplete(false);
    let newBounties = [];
    [newBounties] = await getBountyData(order, 0, orderBy);
    setBounties(newBounties);
    setIsLoading(false);
  }

  async function getMoreData(order, orderBy) {
    setComplete(true);
    const [newBounties, complete] = await getBountyData(order, pagination, orderBy, offChainCursor);
    if (!complete) {
      setComplete(false);
    }
    setBounties(bounties.concat(newBounties));
  }

  const handleToggle = (toggleVal) => {
    setToggleVal(toggleVal);
  };
  const repositories = bounties?.reduce((repositories, bounty) => {
    if (repositories.some((repo) => repo.name === bounty.repoName)) {
      return repositories;
    }
    return [
      ...repositories,
      {
        name: bounty.repoName,
        languages: bounty.languages,
        description: bounty.repoDescription,
        url: bounty.repoUrl,
      },
    ];
  }, []);
  const contestRepositories = bounties?.reduce((repositories, bounty) => {
    if (
      repositories.some(
        (repo) => repo.name === bounty.repoName && (bounty.bountyType === '2' || bounty.bountyType === '3')
      )
    ) {
      return repositories;
    }
    return [
      ...repositories,
      {
        name: bounty.repoName,
        languages: bounty.languages,
        description: bounty.repoDescription,
        url: bounty.repoUrl,
      },
    ];
  }, []);

  // Render
  return (
    <>
      {error ? (
        <UnexpectedErrorModal error={error} />
      ) : (
        <div className='w-full mx-auto text-primary mt-1 px-4 md:px-16 max-w-[1420px] '>
          <OrganizationHeader colour='rust' organizationData={organizationData} />
          <SubMenu
            items={[
              {
                name: 'Overview',
                Svg: Home,
              },
              {
                name: 'Hackathon Submissions',
                Svg: Trophy,
              },
              /*{name: 'About', Svg: Question }*/
            ]}
            internalMenu={toggleVal}
            updatePage={handleToggle}
          />
          {toggleVal === 'Overview' && (
            <div className='px-4 py-3 gap-6 w-full flex flex-wrap md:flex-nowrap'>
              <OrganizationContent
                bounties={bounties}
                loading={isLoading}
                getMoreData={getMoreData}
                complete={complete}
                getNewData={getNewData}
                repositories={repositories}
              />
              <OrganizationMetadata organizationData={organizationData} repositories={repositories} />
            </div>
          )}
          {toggleVal === 'Hackathon Submissions' && (
            <div className='py-3 gap-6 w-full flex flex-col flex-wrap md:flex-nowrap'>
              <HackathonTab repositories={contestRepositories} organization={organizationData} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const batch = 10;
  let renderError = '';
  const { organization } = context.params;
  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const githubRepository = new WrappedGithubClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const utils = new Utils();
  const logger = new Logger();
  githubRepository.instance.setGraphqlHeaders();

  let orgData;
  let orgMetadata = {};
  let mergedOrgData;
  try {
    orgData = await githubRepository.instance.fetchOrgOrUserByLogin(organization);
  } catch (err) {
    return {
      props: {
        renderError: `Could not find ${organization} on Github, does an organization with this name exists on Github?`,
      },
    };
  }
  let org;
  try {
    org = await openQSubgraphClient.instance.getOrganization(orgData.id, batch);
  } catch (err) {
    logger.error(err);
    renderError = 'OpenQ can not display organization data.';
  }
  try {
    orgMetadata = await openQPrismaClient.instance.getOrganization(orgData.id);
    if (orgMetadata.blacklisted === 'true') {
      renderError = 'Organization blacklisted.';
    }
  } catch (err) {
    logger.error(err);
  }
  mergedOrgData = { ...org, ...orgData };
  const bounties = mergedOrgData.bountiesCreated || [];
  const bountyIds = bounties.map((bounty) => bounty.bountyId);
  let issueData;

  try {
    issueData = await githubRepository.instance.getIssueData(bountyIds);
  } catch (err) {
    logger.error(err);
    renderError = 'OpenQ cannot fetch organization data from Github.';
  }
  const prismaContracts = orgMetadata.organization.bounties.bountyConnection.nodes.filter((node) => !node.blacklisted);

  const fullBounties = utils.combineBounties(bounties, issueData, prismaContracts);

  return {
    props: {
      organization,
      organizationData: mergedOrgData,
      fullBounties,
      batch,
      renderError,
      firstCursor: orgMetadata.organization.bounties.bountyConnection.cursor,
    },
  };
};

export default organization;
