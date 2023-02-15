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
import UnexpectedErrorModal from '../components/Utils/UnexpectedErrorModal';
import SubMenu from '../components/Utils/SubMenu';
import { fetchBountiesWithServiceArg, isOnlyContest, getReadyText } from '../services/utils/lib';

export default function Index({ types, renderError, category, mergedOrgs, paginationObj }) {
  // State
  const [watchedBounties, setWatchedBounties] = useState([]);
  const [error, setError] = useState(renderError);

  // Context
  const [appState] = useContext(StoreContext);
  const { reloadNow } = appState;
  const [controlledOrgs, setControlledOrgs] = useState(mergedOrgs);
  const [internalMenu, setInternalMenu] = useState('Organizations');
  const { accountData, logger } = appState;
  // Hooks

  useEffect(() => {
    // get watched bounties as soon as we know what the account is.
    const getWatched = async () => {
      try {
        if (accountData) {
          const [watchedBounties] = await appState.utils.fetchWatchedBounties(accountData, appState, types, category);

          setWatchedBounties(watchedBounties);
        } else {
          setWatchedBounties([]);
        }
      } catch (err) {
        logger.error(err, accountData.id, '[index]1.js');
        setError(err);
      }
    };
    getWatched();
  }, [accountData, reloadNow]);

  useEffect(() => {
    const getOrgs = async () => {
      if (reloadNow) {
        try {
          const mergedOrgs = await appState.utils.fetchOrganizations(appState);
          setControlledOrgs(mergedOrgs);
        } catch (err) {
          logger.error(err, accountData.id, '[index]2.js');
        }
      }
    };
    getOrgs();
  }, [reloadNow]);

  // Methods
  // General method for getting bounty data, used by pagination and handlers.

  // Pagination handler for when user switches sort order.

  return (
    <main className='bg-dark-mode flex-col'>
      {error ? (
        <UnexpectedErrorModal error={renderError} />
      ) : (
        <>
          <SubMenu
            styles={'justify-center'}
            items={[{ name: 'Organizations' }, { name: 'Issues' }]}
            internalMenu={internalMenu}
            updatePage={setInternalMenu}
          />

          {internalMenu === 'Organizations' ? (
            <OrganizationHomepage types={['0', '1', '2', '3']} orgs={controlledOrgs} />
          ) : (
            <BountyHomepage
              paginationObj={paginationObj}
              contractToggle={true}
              types={types}
              watchedBounties={watchedBounties}
            />
          )}
        </>
      )}
    </main>
  );
}

export const getServerSideProps = async () => {
  const githubRepository = new WrappedGithubClient();
  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const appState = {
    githubRepository: githubRepository.instance,
    openQSubgraphClient: openQSubgraphClient.instance,
    openQPrismaClient: openQPrismaClient.instance,
    utils: new Utils(),
    logger: new Logger(),
  };
  const utils = new Utils();
  const logger = new Logger();
  const batch = 10;
  const types = ['0', '1', '2', '3'];
  const getItems = async (oldCursor, batch, ordering, filters) => {
    const value = await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);

    return value;
  };
  const ordering = { sortOrder: 'desc', field: 'createdAt' };
  const { nodes, cursor, complete } = await getItems(null, 2, ordering, { types });

  const paginationObj = {
    items: nodes,
    ordering,
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
    mergedOrgs = await utils.fetchOrganizations({
      openQSubgraphClient: openQSubgraphClient.instance,
      githubRepository: githubRepository.instance,
      openQPrismaClient: openQPrismaClient.instance,
    });
  } catch (err) {
    logger.error(err, null, '[index]4.js');
    renderError = JSON.stringify(err);
  }

  return {
    props: {
      batch,
      types,
      mergedOrgs,
      renderError,
      paginationObj,
    },
  };
};
