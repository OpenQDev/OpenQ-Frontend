import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import Logger from '../../../services/logger/Logger';
import Utils from '../../../services/utils/Utils';

import HackathonHeading from '../../../components/Hackathon/HackathonHeading';
import PanelWithMetadata from '../../../components/Layout/PanelWithMetadata';
import ViewHeading from '../../../components/Hackathon/ViewHeading';
import ViewBody from '../../../components/Hackathon/ViewBody';
import HackathonMetadata from '../../../components/Hackathon/HackathonMetadata';
import ViewHackathonBounties from '../../../components/Hackathon/ViewHackathonBounties';
import StoreContext from '../../../store/Store/StoreContext';
import { fetchBountiesWithServiceArg, getReadyText, isOnlyContest } from '../../../services/utils/lib';
import PaginatedList from '../../../components/Utils/PaginatedList';
import SearchBar from '../../../components/SearchBar';
import ShowCaseCard from '../../../components/ShowCase/NewShowCaseCard';
import ShowCasePage from '../../../components/ShowCase/ShowCasePage';
import { ChevronLeftIcon } from '@primer/octicons-react';

const Hackathon = ({ githubRepository, hackathon, paginationObj }) => {
  const internalMenuState = useState('View');
  const [internalMenu] = internalMenuState;

  const [appState] = useContext(StoreContext);
  const [searchValue, setSearchValue] = useState('');
  const [singleSubmission, setSingleSubmission] = useState(null);

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
    fetchFilters: { name: githubRepository.name, org: githubRepository.owner.login },
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
    <div className='pt-4'>
      <HackathonHeading internalMenuState={internalMenuState} githubRepository={githubRepository} />
      {internalMenu === 'View' && (
        <div className='flex justify-between  w-full px-2 sm:px-8  max-w-[1200px] pb-4 mx-auto'>
          <ViewHeading hackathon={hackathon} />
        </div>
      )}
      <PanelWithMetadata>
        {internalMenu === 'View' && <ViewBody githubRepository={githubRepository} hackathon={hackathon} />}
        {internalMenu === 'Bounties' && (
          <ViewHackathonBounties
            paginationObj={paginationObj}
            githubRepository={githubRepository}
            hackathon={hackathon}
          />
        )}
        {internalMenu === 'Submissions' ? (
          <div className='w-full flex relative flex-1 pt-8 min-w-[260px]'>
            <div className=' gap-6 w-full flex flex-wrap md:flex-nowrap'>
              {!singleSubmission ? (
                <div className='flex flex-col w-full'>
                  <SearchBar
                    onKeyUp={filterBySubmission}
                    searchText={searchValue}
                    placeholder='Search Projects'
                    styles={'flex max-w-[1200px] text-xl py-3 mb-8  placeholder:text-nav-bg'}
                  />
                  <PaginatedList
                    paginationState={githubPaginationState}
                    PaginationCard={ShowCaseCard}
                    className='grid grid-cols-[_repeat(_auto-fit,_minmax(250px,_1fr))] flex-wrap gap-6 w-full items-start'
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
          </div>
        ) : (
          <HackathonMetadata githubRepository={githubRepository} hackathon={hackathon} />
        )}
      </PanelWithMetadata>
    </div>
  );
};
export default Hackathon;

export const getServerSideProps = async (context) => {
  const githubClient = new WrappedGithubClient();
  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();

  const utils = new Utils();
  const logger = new Logger();
  const batch = 2;
  const types = ['3'];
  const appState = {
    githubRepository: githubClient.instance,
    openQSubgraphClient: openQSubgraphClient.instance,
    openQPrismaClient: openQPrismaClient.instance,
    utils,
    logger,
  };

  const repositoryId = context.query.id;
  const hackathon = await openQPrismaClient.instance.getRepositoryById(repositoryId);
  const githubRepository = await githubClient.instance.fetchRepoById(repositoryId);
  const getItems = async (oldCursor, batch, ordering, filters) => {
    return await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);
  };
  const ordering = { sortOrder: 'desc', field: 'createdAt' };
  console.log(githubRepository.owner);
  const fetchFilters = { types, organizationId: githubRepository.owner.id, repositoryId: githubRepository.id };
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
    props: { githubRepository, hackathon, paginationObj },
  };
};
