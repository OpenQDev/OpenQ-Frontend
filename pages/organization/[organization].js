// Third party
import React, { useState } from 'react';

// Custom
import WrappedOpenQSubgraphClient from '../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedGithubClient from '../../services/github/WrappedGithubClient';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import Logger from '../../services/logger/Logger';
import Utils from '../../services/utils/Utils';
import OrganizationHeader from '../../components/Organization/OrganizationHeader';
import SubMenu from '../../components/Utils/SubMenu';
import Home from '../../components/svg/home';
// import Trophy from '../../components/svg/trophy';
import OrganizationMetadata from '../../components/Organization/OrganizationMetadata';
import OrganizationContent from '../../components/Organization/OrganizationContent';
// import HackathonTab from '../../components/Organization/HackathonTab.js';

import UnexpectedErrorModal from '../../components/Utils/UnexpectedErrorModal';
import { getReadyText, isOnlyContest, fetchBountiesWithServiceArg } from '../../services/utils/lib';

const organization = ({ organizationData, renderError, paginationObj }) => {
  // Context
  const [toggleVal, setToggleVal] = useState('Overview');
  // Methods

  const handleToggle = (toggleVal) => {
    setToggleVal(toggleVal);
  };
  const repositories = paginationObj.items.reduce((repositories, bounty) => {
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
        id: bounty.repoId,
      },
    ];
  }, []);
  /* const contestRepositories = bounties?.reduce((repositories, bounty) => {
    if (
      repositories.some((repo) => repo.name === bounty.repoName) ||
      (bounty.bountyType !== '2' && bounty.bountyType !== '3')
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
        id: bounty.repoId,
      },
    ];
  }, []); */

  /* const hackSubmissions =
    contestRepositories?.length > 0
      ? [
          {
            name: 'Hackathon Submissions',
            Svg: Trophy,
          },
        ]
      : []; */

  // Render
  return (
    <>
      {renderError ? (
        <UnexpectedErrorModal error={renderError} />
      ) : (
        <div className='w-full mx-auto text-primary mt-1 px-4 md:px-16 max-w-[1420px] '>
          <OrganizationHeader colour='rust' organizationData={organizationData} />
          <SubMenu
            items={[
              {
                name: 'Overview',
                Svg: Home,
              },
              /* ...hackSubmissions, */
              /*{name: 'About', Svg: Question }*/
            ]}
            internalMenu={toggleVal}
            updatePage={handleToggle}
          />
          {toggleVal === 'Overview' && (
            <div className='px-4 py-3 gap-6 w-full flex flex-wrap md:flex-nowrap'>
              <OrganizationContent
                paginationObj={paginationObj}
                repositories={repositories}
                organizationData={organizationData}
              />
              <OrganizationMetadata organizationData={organizationData} repositories={repositories} />
            </div>
          )}
          {/* {toggleVal === 'Hackathon Submissions' && (
            <div className='py-3 gap-6 w-full flex flex-col flex-wrap md:flex-nowrap'>
              <HackathonTab repositories={contestRepositories} organization={organizationData} />
            </div>
          )} */}
        </div>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const githubRepository = new WrappedGithubClient();
  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();

  const batch = 10;
  let renderError = '';
  const { organization } = context.params;
  const utils = new Utils();
  const logger = new Logger();

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
    logger.error(err, null, '[organization.js]2');
    renderError = 'OpenQ can not display organization data.';
  }
  try {
    orgMetadata = await openQPrismaClient.instance.getOrganization(orgData.id);
    if (orgMetadata.blacklisted === 'true') {
      renderError = 'Organization blacklisted.';
    }
  } catch (err) {
    logger.error(err, null, '[organization.js]3');
  }
  mergedOrgData = { ...org, ...orgData };

  const appState = {
    githubRepository: githubRepository.instance,
    openQSubgraphClient: openQSubgraphClient.instance,
    openQPrismaClient: openQPrismaClient.instance,
    utils,
    logger,
  };
  const types = ['1', '2', '3', '4'];

  const getItems = async (oldCursor, batch, ordering, filters) => {
    return await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);
  };
  const ordering = { sortOrder: 'desc', field: 'createdAt' };
  const fetchFilters = { types, organizationId: orgData.id };
  const { nodes, cursor, complete } = await getItems(null, batch, ordering, fetchFilters);

  const paginationObj = {
    items: nodes,
    ordering: { direction: 'desc', field: 'createdAt' },
    fetchFilters,
    filters: {
      searchText: `order:newest`,
      isReady: getReadyText(isOnlyContest(types)),
    },
    cursor,
    complete,
    batch,
  };

  return {
    props: { renderError, paginationObj, organizationData: mergedOrgData },
  };
};

export default organization;
