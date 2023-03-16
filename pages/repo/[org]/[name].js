// Third party
import React, { useContext, useState } from 'react';

import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import OrganizationHeader from '../../../components/Organization/OrganizationHeader';
import SubMenu from '../../../components/Utils/SubMenu';
import { Home, Trophy } from '../../../components/svg/home';
import BountyList from '../../../components/BountyList';
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import Logger from '../../../services/logger/Logger';
import Utils from '../../../services/utils/Utils';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import { getReadyText, isOnlyContest, fetchBountiesWithServiceArg } from '../../../services/utils/lib';
import SearchBar from '../../../components/Search/SearchBar';
import ShowCaseCard from '../../../components/ShowCase/ShowCaseCard';
import StoreContext from '../../../store/Store/StoreContext';
import PaginatedList from '../../../components/Utils/PaginatedList';
import ShowCasePage from '../../../components/ShowCase/ShowCasePage';
import { ChevronLeftIcon } from '@primer/octicons-react';
import Link from 'next/link';
import Image from 'next/image';

const showcase = ({ org, name, renderError, orgData, repoData, paginationObj }) => {
  // Context
  const [appState] = useContext(StoreContext);
  const [toggleVal, setToggleVal] = useState('Overview');
  const [searchValue, setSearchValue] = useState('');
  const [singleSubmission, setSingleSubmission] = useState(null);
  // Render

  const handleToggle = (toggleVal) => {
    setToggleVal(toggleVal);
  };

  const getNonBlacklisted = async (appState, oldCursor, batch, ordering, filters) => {
    const { repoPrs, pageInfo } = await appState.githubRepository.getPrs(
      filters.org,
      filters.name,
      batch,
      oldCursor,
      ordering
    );

    const prs = await appState.openQPrismaClient.getSubmissions();
    const blacklistedPrIds = prs.filter((pr) => pr.blacklisted).map((pr) => pr.id);

    return {
      nodes: repoPrs.filter((pr) => !blacklistedPrIds.includes(pr.id)),
      cursor: pageInfo.endCursor,
      complete: !pageInfo.hasNextPage,
    };
  };

  const getItems = async (oldCursor, batch, ordering, filters = {}) => {
    return await getNonBlacklisted(appState, oldCursor, batch, ordering, filters);
  };

  const filterFunction = (item, filters) => {
    return item.title.includes(filters.searchText) || item.body.includes(filters.searchText);
  };

  const githubPagination = {
    items: [],
    ordering: { direction: 'DESC', field: 'CREATED_AT' },
    filters: { searchText: '' },
    fetchFilters: { name, org },
    cursor: null,
    complete: false,
    batch: 10,
    filterFunction: filterFunction,
    getItems,
  };

  const githubPaginationState = useState(githubPagination);
  const [githubPaginationObj, setGithubPaginationObj] = githubPaginationState;

  const filterBySubmission = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    setGithubPaginationObj({
      ...githubPaginationObj,
      filters: { ...githubPaginationObj.filters, searchText: val },
    });
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
              { name: 'Hackathon Submissions', Svg: Trophy },
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
          {toggleVal === 'Hackathon Submissions' && (
            <>
              <div className='px-4 py-3 gap-6 w-full flex flex-wrap md:flex-nowrap'>
                {!singleSubmission ? (
                  <div className='flex flex-col w-full'>
                    <h2 className='text-primary w-full mb-2'>Submissions for {name}</h2>
                    <SearchBar
                      onKeyUp={filterBySubmission}
                      searchText={searchValue}
                      placeholder='Search Submissions...'
                      styles={'flex max-w-[960px] mb-8'}
                    />
                    <PaginatedList
                      paginationState={githubPaginationState}
                      PaginationCard={ShowCaseCard}
                      className='flex flex-wrap gap-8 w-full items-start'
                      singleSubmission={singleSubmission}
                      setSingleSubmission={setSingleSubmission}
                    />
                  </div>
                ) : (
                  <>
                    <div className='flex-1 pt-4 pb-8 w-full max-w-[1200px] justify-center'>
                      <button
                        onClick={() => setSingleSubmission(false)}
                        className='flex items-center gap-1 btn-default w-fit'
                      >
                        <ChevronLeftIcon size={16} />
                        Back to the submissions overview
                      </button>
                      <ShowCasePage pr={singleSubmission} />
                    </div>
                    <ul className='lg:max-w-[300px] w-full lg:pl-4 p-8 lg:p-0'>
                      <li className='border-b border-web-gray py-3'>
                        <div className='text-xs font-semibold text-muted'>Created</div>
                        <div className='text-xs font-semibold text-primary leading-loose'>
                          {appState.utils.formatDate(singleSubmission.createdAt)}
                        </div>
                      </li>
                      <li className='border-b border-web-gray py-3'>
                        <div className='text-xs font-semibold text-muted'>Author</div>
                        <div className='text-xs font-semibold text-primary leading-loose'>
                          <Link href={singleSubmission.author.url} rel='noopener norefferer' target='_blank'>
                            <span className='text-link-colour cursor-pointer hover:underline flex items-center gap-2'>
                              {singleSubmission.author.login}{' '}
                              <Image
                                className='rounded-lg h-6'
                                src={singleSubmission.author.avatarUrl}
                                height={24}
                                width={24}
                                alt='avatar'
                              />
                            </span>
                          </Link>
                        </div>
                      </li>
                      <li className='border-b border-web-gray py-3'>
                        <div className='text-xs font-semibold text-muted'>View on GitHub</div>
                        <div className='text-xs font-semibold text-primary leading-loose'>
                          Pull Request{' '}
                          <Link href={singleSubmission.url} rel='noopener norefferer' target='_blank'>
                            <span className='text-link-colour cursor-pointer hover:underline'>
                              #{singleSubmission.url.split('/').pop()}
                            </span>
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </>
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
  const batch = 2;
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
    props: {
      renderError,
      orgData,
      repoData,
      paginationObj,
      org,
      name,
    },
  };
}
