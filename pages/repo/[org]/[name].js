// Third party
import React, { useContext, useState, useEffect } from 'react';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';

import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import OrganizationHeader from '../../../components/Organization/OrganizationHeader';
import SubMenu from '../../../components/Utils/SubMenu';
import Home from '../../../components/svg/home';
import Telescope from '../../../components/svg/telescope';
import BountyList from '../../../components/BountyList';
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import Logger from '../../../services/logger/Logger';
import Utils from '../../../services/utils/Utils';
import { getReadyText, isOnlyContest, fetchBountiesWithServiceArg } from '../../../services/utils/lib';
import StoreContext from '../../../store/Store/StoreContext';
import ClaimsTracking from '../../../components/Claim/ClaimsTracking';

const showcase = ({ renderError, orgData, repoData, paginationObj, fetchFilters }) => {
  // Context
  const [appState] = useContext(StoreContext);
  const [toggleVal, setToggleVal] = useState('Overview');
  const [TVLBalances, setTVLBalances] = useState([]);
  const [payoutBalances, setPayoutBalances] = useState([]);
  const [showOverview, setShowOverview] = useState();
  const githubId = appState.accountData.github;

  useEffect(() => {
    const fetchTotals = async (orgId) => {
      try {
        const fetchedData = await appState.openQSubgraphClient.getTotalFundedPerOrganizationId(orgId);
        const fetchedTotalPayouts = await appState.openQSubgraphClient.getTotalPayoutPerOrganizationId(orgId);
        setPayoutBalances(fetchedTotalPayouts);
        setTVLBalances(fetchedData);
      } catch (err) {
        appState.logger.error(err, '[name].js1');
      }
    };
    fetchTotals(orgData.id);
  }, []);

  useEffect(() => {
    const updateIsAdmin = async () => {
      const team = 'developers';
      const login = 'OpenQDev';
      const isAdmin = await appState.githubRepository.getIsAdmin(login, team, githubId);
      setShowOverview(isAdmin);
    };
    if (githubId) updateIsAdmin();
  }, [githubId]);
  // Render

  const handleToggle = (toggleVal) => {
    setToggleVal(toggleVal);
  };

  return (
    <>
      {renderError ? (
        <UnexpectedErrorModal error={renderError} />
      ) : (
        <div className='w-full mx-auto text-primary mt-1 px-4 md:px-16 max-w-[1420px] '>
          <OrganizationHeader organizationData={orgData} repository={repoData}></OrganizationHeader>
          <SubMenu
            items={[
              { name: 'Overview', Svg: Home },
              ...[showOverview ? { name: 'Claim Progress', Svg: Telescope } : {}],
            ]}
            internalMenu={toggleVal}
            updatePage={handleToggle}
          />
          {toggleVal === 'Overview' && (
            <>
              <div className='px-4 py-3 gap-6 w-full flex flex-wrap md:flex-nowrap'>
                <div className='max-w-[960px] w-full md:basis-3/4 md:shrink'>
                  <h2 className='text-primary w-full mb-2'>Smart Contracts</h2>
                  <BountyList paginationObj={paginationObj} contractToggle={true} types={['0', '1', '2', '3']} />
                </div>
                <ul className='w-full max-w-[960px] md:shrink-0 md:basis-1/4'>
                  {repoData.languages.edges.length > 0 && (
                    <li className='border-b border-web-gray pb-8' key='languages'>
                      <div className='text-normal text-primary py-4 flex'>Top Languages</div>
                      <div className='flex flex-wrap gap-2 w-60'>
                        {' '}
                        {repoData.languages.edges.map((language, index) => {
                          return (
                            <div className='w-fit inline' key={index}>
                              {' '}
                              <div
                                style={{ backgroundColor: language.node.color }}
                                className='w-3 h-3 rounded-lg inline-block'
                              ></div>{' '}
                              <span className='text-sm'>{language.node.name}</span>
                            </div>
                          );
                        })}{' '}
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}

          {showOverview && toggleVal === 'Claim Progress' && (
            <ClaimsTracking fetchFilters={fetchFilters} TVLBalances={TVLBalances} payoutBalances={payoutBalances} />
          )}
        </div>
      )}
    </>
  );
};
export default showcase;

export async function getServerSideProps(context) {
  const githubRepository = new WrappedGithubClient();
  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();

  const { org, name } = context.query;
  const utils = new Utils();
  const logger = new Logger();
  const batch = 20;
  const types = ['0', '1', '2', '3'];
  const appState = {
    githubRepository: githubRepository.instance,
    openQSubgraphClient: openQSubgraphClient.instance,
    openQPrismaClient: openQPrismaClient.instance,
    utils,
    logger,
  };

  let renderError = '';
  let orgData;
  let repoData;
  try {
    orgData = await githubRepository.instance.fetchOrgOrUserByLogin(org);
  } catch (err) {
    return {
      props: {
        renderError: `Could not find ${org} on Github, does an organization with this name exists on Github?`,
      },
    };
  }
  try {
    repoData = await githubRepository.instance.fetchRepoByName(org, name);
  } catch (err) {
    return {
      props: {
        renderError: `Could not find ${name} for the organization ${org} on Github, does this repository and / or organization exist on Github?`,
      },
    };
  }
  const getItems = async (oldCursor, batch, ordering, filters) => {
    return await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);
  };
  const ordering = { sortOrder: 'desc', field: 'createdAt' };
  const fetchFilters = { types, organizationId: orgData.id, repositoryId: repoData.id };
  const { nodes, cursor, complete } = await getItems(null, batch, ordering, fetchFilters);
  const paginationObj = {
    items: nodes,
    ordering: { sortOrder: 'desc', field: 'createdAt' },
    fetchFilters,
    filters: {
      searchText: ``,
      isReady: getReadyText(isOnlyContest(types)),
    },
    cursor,
    complete,
    batch,
  };

  return {
    props: {
      renderError,
      orgData,
      repoData,
      paginationObj,
      org,
      name,
      fetchFilters,
    },
  };
}
