// Third party
import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../store/Store/StoreContext';

// Custom
import BountyHomepage from '../components/Bounty/BountyHomepage';
import OrganizationHomepage from '../components/Organization/OrganizationHomepage';
import WrappedGithubClient from '../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../services/openq-api/WrappedOpenQPrismaClient';
import Utils from '../services/utils/Utils';
import Logger from '../services/logger/Logger';
import SubMenu from '../components/Utils/SubMenu';
import UnexpectedErrorModal from '../components/Utils/UnexpectedErrorModal';
import { fetchBountiesWithServiceArg, isOnlyContest, getReadyText } from '../services/utils/lib';

export default function Index({ orgs, types, category, renderError, paginationObj }) {
  const isContest = isOnlyContest(types);
  const issuesTitle = isContest ? 'Hackathons' : 'Issues';
  // State
  const [internalMenu, setInternalMenu] = useState(issuesTitle);
  const [controlledOrgs, setControlledOrgs] = useState(orgs);
  const [watchedBounties, setWatchedBounties] = useState([]);

  // Context
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { reloadNow } = appState;
  // Hooks
  useEffect(() => {
    // handle org reloaasyncd events (caused by user starring org.)
    const handleReload = async () => {
      if (reloadNow) {
        try {
          const mergedOrgs = await appState.utils.fetchOrganizations(appState, types, category);
          setControlledOrgs(mergedOrgs);
        } catch (err) {
          appState.logger.error(err, accountData.id, '[type]1.js');
        }
        // get watched bounties when reload action is triggered.
      }
    };
    handleReload();
  }, [reloadNow]);

  useEffect(() => {
    // get watched bounties as soon as we know what the account is.
    const getMyWatched = async () => {
      if (accountData) {
        const [watchedBounties] = await appState.utils.fetchWatchedBounties(accountData, appState, types, category);
        setWatchedBounties(watchedBounties || []);
      } else {
        setWatchedBounties([]);
      }
    };
    getMyWatched();
  }, [accountData, reloadNow]);

  // Methods

  return (
    <main className='bg-dark-mode flex-col'>
      <div className='flex justify-center'>
        <SubMenu
          updatePage={setInternalMenu}
          internalMenu={internalMenu}
          styles={'justify-center'}
          items={[{ name: issuesTitle }, { name: 'Organizations' }]}
        />
      </div>
      <div>
        {renderError ? (
          <UnexpectedErrorModal error={renderError} />
        ) : internalMenu == 'Organizations' ? (
          <OrganizationHomepage orgs={controlledOrgs} types={types} />
        ) : (
          <BountyHomepage paginationObj={paginationObj} watchedBounties={watchedBounties} types={types} />
        )}
      </div>
    </main>
  );
}

export const getServerSideProps = async (context) => {
  const githubRepository = new WrappedGithubClient();
  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const utils = new Utils();
  const logger = new Logger();

  let types = ['0', '1', '2', '3'];
  let category = null;
  switch (context?.query?.type) {
    case 'fixed-price':
      types = ['0'];
      break;
    case 'marketplace':
      types = ['0', '1'];
      break;
    case 'contests':
      types = ['2', '3'];
      break;
  }

  const batch = 10;
  const appState = {
    githubRepository: githubRepository.instance,
    openQSubgraphClient: openQSubgraphClient.instance,
    openQPrismaClient: openQPrismaClient.instance,
    utils,
    logger,
  };
  const getItems = async (oldCursor, batch, ordering, filters) => {
    return await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);
  };
  const ordering = { sortOrder: 'desc', field: 'createdAt' };
  const { nodes, cursor, complete } = await getItems(null, batch, ordering, { types });

  const paginationObj = {
    items: nodes,
    ordering: { direction: 'desc', field: 'createdAt' },
    fetchFilters: { types },
    filters: {
      searchText: `order:newest`,
      isReady: getReadyText(isOnlyContest(types)),
    },
    cursor,
    complete,
    batch,
  };
  let renderError = '';
  let mergedOrgs = [];
  try {
    mergedOrgs = await utils.fetchOrganizations(
      {
        githubRepository: githubRepository.instance,
        openQPrismaClient: openQPrismaClient.instance,
      },
      types,
      category
    );
  } catch (err) {
    logger.error(err, null, '[type]1.js');

    renderError = JSON.stringify(err);
  }

  return {
    props: {
      orgs: mergedOrgs,
      renderError,
      batch,
      types,
      category,

      paginationObj,
    },
  };
};
