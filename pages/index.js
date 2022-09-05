// Third party
import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../store/Store/StoreContext';

// Custom
import BountyHomepage from '../components/Bounty/BountyHomepage';
import OrganizationHomepage from '../components/Organization/OrganizationHomepage';
import useWeb3 from '../hooks/useWeb3';
import useAuth from '../hooks/useAuth';
import WrappedGithubClient from '../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../services/openq-api/WrappedOpenQPrismaClient';
import Utils from '../services/utils/Utils';
import UnexpectedError from '../components/Utils/UnexpectedError';
import SubMenu from '../components/Utils/SubMenu';

export default function Index({ fullBounties, batch, types, renderError, firstCursor, category, mergedOrgs }) {
  // State

  const [bounties, setBounties] = useState(fullBounties);
  const [isLoading, setIsLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [pagination, setPagination] = useState(batch);
  const [offChainCursor, setOffChainCursor] = useState(firstCursor);
  const [watchedBounties, setWatchedBounties] = useState([]);

  // Context
  const [appState] = useContext(StoreContext);
  const { reloadNow } = appState;
  const { account } = useWeb3();
  const [authState] = useAuth();
  const { signedAccount } = authState;
  const [controlledOrgs, setControlledOrgs] = useState(mergedOrgs);
  const [internalMenu, setInternalMenu] = useState('Organizations');
  // Hooks

  useEffect(async () => {
    // get watched bounties as soon as we know what the account is.
    if (account == signedAccount && account) {
      const [watchedBounties] = await appState.utils.fetchWatchedBounties(appState, account, category, types);
      setWatchedBounties(watchedBounties || []);
    } else {
      setWatchedBounties([]);
    }
  }, [account, reloadNow, signedAccount]);

  useEffect(async () => {
    if (reloadNow) {
      const [mergedOrgs] = await appState.utils.fetchOrganizations(appState);
      setControlledOrgs(mergedOrgs);
    }
  }, [reloadNow]);

  // Methods
  // General method for getting bounty data, used by pagination and handlers.
  async function getBountyData(sortOrder, currentPagination, orderBy, cursor) {
    setPagination(() => currentPagination + batch);
    let complete = false;
    const [fullBounties, newCursor] = await appState.utils.fetchBounties(
      appState,
      batch,
      category,
      sortOrder,
      orderBy,
      cursor
    );
    setOffChainCursor(newCursor);

    if (fullBounties?.length === 0) {
      complete = true;
    }
    return [fullBounties, complete];
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
      {renderError ? (
        <UnexpectedError error={renderError} />
      ) : (
        <>
          <SubMenu
            styles={'justify-center'}
            items={[{ name: 'Organizations' }, { name: 'Issues' }]}
            internalMenu={internalMenu}
            updatePage={setInternalMenu}
          />

          {internalMenu === 'Organizations' ? (
            <OrganizationHomepage types={['0', '1', '2', '3']} wizard='true' orgs={controlledOrgs} />
          ) : (
            <BountyHomepage
              types={types}
              bounties={bounties}
              watchedBounties={watchedBounties}
              loading={isLoading}
              getMoreData={getMoreData}
              complete={complete}
              getNewData={getNewData}
              wizard={true}
              contractToggle={true}
            />
          )}
        </>
      )}
    </main>
  );
}

export const getServerSideProps = async () => {
  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const githubRepository = new WrappedGithubClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const utils = new Utils();
  githubRepository.instance.setGraphqlHeaders();
  const batch = 10;
  const types = ['0', '1', '2', '3'];

  const [fullBounties, firstCursor] = await utils.fetchBounties(
    {
      openQSubgraphClient: openQSubgraphClient.instance,
      githubRepository: githubRepository.instance,
      openQPrismaClient: openQPrismaClient.instance,
    },
    batch
  );
  const [mergedOrgs] = await utils.fetchOrganizations({
    openQSubgraphClient: openQSubgraphClient.instance,
    githubRepository: githubRepository.instance,
    openQPrismaClient: openQPrismaClient.instance,
  });

  return {
    props: {
      fullBounties,
      firstCursor,
      batch,
      types,
      mergedOrgs,
    },
  };
};
