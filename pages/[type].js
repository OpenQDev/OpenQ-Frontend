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

export default function Index({ orgs, fullBounties, batch, types, category, renderError, firstCursor }) {
  // State
  const [internalMenu, setInternalMenu] = useState('Issues');
  const [controlledOrgs, setControlledOrgs] = useState(orgs);
  const [bounties, setBounties] = useState(fullBounties);
  const [isLoading, setIsLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [pagination, setPagination] = useState(batch);
  const [offChainCursor, setOffChainCursor] = useState(firstCursor);
  const [watchedBounties, setWatchedBounties] = useState([]);
  const [error, setError] = useState(renderError);

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

  // General method for getting bounty data, used by pagination and handlers.
  async function getBountyData(sortOrder, currentPagination, orderBy, cursor) {
    setPagination(() => currentPagination + batch);
    let complete = false;
    try {
      const [fullBounties, newCursor] = await appState.utils.fetchBounties(
        appState,
        batch,
        types,
        sortOrder,
        orderBy,
        cursor,
        undefined,
        undefined,
        category
      );
      setOffChainCursor(newCursor);

      if (fullBounties?.length === 0) {
        complete = true;
      }

      return [fullBounties, complete];
    } catch (err) {
      setError(JSON.stringify(err));
      return [[], true];
    }
  }

  // Pagination handler for when user switches sort order.
  async function getNewData(order, orderBy) {
    setIsLoading(true);
    setComplete(false);
    let newBounties = [];
    [newBounties] = await getBountyData(order, 0, orderBy);
    setBounties(newBounties);
    setIsLoading(false);
  }

  // Pagination handler for when user just needs another page of the same sort order.
  async function getMoreData(order, orderBy) {
    setComplete(true);
    const [newBounties, complete] = await getBountyData(order, pagination, orderBy, offChainCursor);
    if (!complete) {
      setComplete(false);
    }
    setBounties(bounties.concat(newBounties));
  }

  return (
    <main className='bg-dark-mode flex-col'>
      <div className='flex justify-center'>
        <SubMenu
          updatePage={setInternalMenu}
          internalMenu={internalMenu}
          styles={'justify-center'}
          items={[{ name: 'Issues' }, { name: 'Organizations' }]}
        />
      </div>
      <div>
        {error ? (
          <UnexpectedErrorModal error={error} />
        ) : internalMenu == 'Organizations' ? (
          <OrganizationHomepage orgs={controlledOrgs} types={types} />
        ) : (
          <BountyHomepage
            bounties={bounties}
            watchedBounties={watchedBounties}
            loading={isLoading}
            getMoreData={getMoreData}
            complete={complete}
            getNewData={getNewData}
            types={types}
          />
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
    case 'contests':
      types = ['2', '3'];
      break;
    case 'split-price':
      types = ['1'];
      break;
    case 'non-profit':
      category = 'non-profit';
      types = ['0', '1', '2', '3'];
      break;
  }

  const batch = 10;
  let fullBounties = [];
  let firstCursor = null;
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
  try {
    [fullBounties, firstCursor] = await utils.fetchBounties(
      {
        openQSubgraphClient: openQSubgraphClient.instance,
        githubRepository: githubRepository.instance,
        openQPrismaClient: openQPrismaClient.instance,
        logger,
      },
      batch,
      types,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      category
    );
  } catch (err) {
    logger.error(err, null, '[type]1.js');
    renderError = JSON.stringify(err);
  }
  return {
    props: {
      orgs: mergedOrgs,
      fullBounties,
      renderError,
      batch,
      types,
      category,
      firstCursor,
    },
  };
};
