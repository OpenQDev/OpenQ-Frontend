// Third party
import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../store/Store/StoreContext';

// Custom
import BountyHomepage from '../components/Bounty/BountyHomepage';
import OrganizationHomepage from '../components/Organization/OrganizationHomepage';
import useWeb3 from '../hooks/useWeb3';
import WrappedGithubClient from '../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../services/openq-api/WrappedOpenQPrismaClient';
import Utils from '../services/utils/Utils';
import Logger from '../services/logger/Logger';
import UnexpectedErrorModal from '../components/Utils/UnexpectedErrorModal';
import SubMenu from '../components/Utils/SubMenu';

export default function Index({ fullBounties, batch, types, renderError, firstCursor, category, mergedOrgs }) {
  // State
  const [bounties, setBounties] = useState(fullBounties);
  const [isLoading, setIsLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [pagination, setPagination] = useState(batch);
  const [offChainCursor, setOffChainCursor] = useState(firstCursor);
  const [watchedBounties, setWatchedBounties] = useState([]);
  const [error, setError] = useState(renderError);

  // Context
  const [appState] = useContext(StoreContext);
  const { reloadNow } = appState;
  const { account } = useWeb3();
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
  async function getBountyData(sortOrder, currentPagination, orderBy, cursor) {
    setPagination(() => currentPagination + batch);
    let complete = false;
    try {
      let [fullBounties, newCursor] = await appState.utils.fetchBounties(
        appState,
        batch,
        category,
        sortOrder,
        orderBy,
        cursor,
        null,
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
              types={types}
              bounties={bounties}
              watchedBounties={watchedBounties}
              loading={isLoading}
              getMoreData={getMoreData}
              complete={complete}
              getNewData={getNewData}
              contractToggle={true}
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
  const utils = new Utils();
  const logger = new Logger();
  const batch = 10;
  const types = ['0', '1', '2', '3'];
  let fullBounties = [];
  let firstCursor;
  let renderError = '';
  let mergedOrgs = [];
  try {
    [fullBounties, firstCursor] = await utils.fetchBounties(
      {
        openQSubgraphClient: openQSubgraphClient.instance,
        githubRepository: githubRepository.instance,
        openQPrismaClient: openQPrismaClient.instance,
      },
      batch
    );
  } catch (err) {
    logger.error(err, null, '[index]3.js');
    renderError = JSON.stringify(err);
  }

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
      fullBounties,
      firstCursor: firstCursor || null,
      batch,
      types,
      mergedOrgs,
      renderError,
    },
  };
};
