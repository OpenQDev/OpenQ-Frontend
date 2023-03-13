// Third party
import React, { useState } from 'react';

// import SearchBar from '../../../components/Search/SearchBar';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
// import SubmissionCard from '../../../components/Submissions/SubmissionCard';
import OrganizationHeader from '../../../components/Organization/OrganizationHeader';
import SubMenu from '../../../components/Utils/SubMenu';
import { Home, Trophy } from '../../../components/svg/home';
// import Trophy from '../../../components/svg/trophy';
import BountyList from '../../../components/BountyList';
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import Logger from '../../../services/logger/Logger';
import Utils from '../../../services/utils/Utils';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import {
  getReadyText,
  isOnlyContest,
  fetchBountiesWithServiceArg,
  getNonBlacklisted,
} from '../../../services/utils/lib';
import SearchBar from '../../../components/Search/SearchBar';
import SubmissionCard from '../../../components/Submissions/SubmissionCard';

const showcase = ({ name, currentPrs, renderError, orgData, repoData, paginationObj }) => {
  // Context
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState('');
  const [toggleVal, setToggleVal] = useState('Overview');
  // Render

  const handleToggle = (toggleVal) => {
    setToggleVal(toggleVal);
  };
  const filterBySubmission = (e) => {
    setSubmissionSearchTerm(e.target.value);
  };

  const classifyDay = (time) => {
    const prTime = Math.floor(new Date(time).getTime() / 1000);
    const compare = Date.now() / 1000 - prTime;
    if (compare < 86400) {
      return 'Today';
    } else if (compare < 86400 * 2) {
      return 'Yesterday';
    } else {
      return 'Earlier';
    }
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
            <div className='  w-full px-2 sm:px-8 flex-wrap max-w-[1028px] pb-8'>
              <h1 className='text-4xl py-16 flex-1 leading-tight min-w-[240px] pr-20'>Submissions for {name}</h1>

              <div className='lg:col-start-2 justify-between justify-self-center space-y-3 w-full pb-8'>
                <SearchBar
                  onKeyUp={filterBySubmission}
                  searchText={submissionSearchTerm}
                  placeholder='Search Submissions...'
                  styles={''}
                />
                {currentPrs.some(
                  (pr) =>
                    classifyDay(pr.createdAt) === 'Today' &&
                    (pr.title.includes(submissionSearchTerm) || pr.body.includes(submissionSearchTerm))
                ) && (
                  <>
                    <h2 className='text-3xl pt-16 py-4 flex-1 leading-tight min-w-[240px] pr-20'>Submitted Today</h2>
                    <div className='flex flex-wrap gap-8 w-full items-start'>
                      {currentPrs
                        .filter((pr) => classifyDay(pr.createdAt) === 'Today')
                        .filter(
                          (pr) => pr.title.includes(submissionSearchTerm) || pr.body.includes(submissionSearchTerm)
                        )
                        .map((pr, index) => (
                          <SubmissionCard key={index} pr={pr} />
                        ))}
                    </div>
                  </>
                )}
                {currentPrs.some(
                  (pr) =>
                    classifyDay(pr.createdAt) === 'Yesterday' &&
                    (pr.title.includes(submissionSearchTerm) || pr.body.includes(submissionSearchTerm))
                ) && (
                  <>
                    <h2 className='text-3xl pt-16 py-4 flex-1 leading-tight min-w-[240px] pr-20'>
                      Submitted Yesterday
                    </h2>
                    <div className='flex flex-wrap gap-8 w-full items-start'>
                      {currentPrs
                        .filter((pr) => classifyDay(pr.createdAt) === 'Yesterday')
                        .filter(
                          (pr) => pr.title.includes(submissionSearchTerm) || pr.body.includes(submissionSearchTerm)
                        )
                        .map((pr, index) => (
                          <SubmissionCard key={index} pr={pr} />
                        ))}
                    </div>
                  </>
                )}
                {currentPrs.some(
                  (pr) =>
                    classifyDay(pr.createdAt) === 'Earlier' &&
                    (pr.title.includes(submissionSearchTerm) || pr.body.includes(submissionSearchTerm))
                ) && (
                  <>
                    <h2 className='text-3xl pt-16 py-4 flex-1 leading-tight min-w-[240px] pr-20'>
                      Submitted more than 48 hours ago
                    </h2>
                    <div className='flex flex-wrap gap-8 w-full items-start'>
                      {currentPrs
                        .filter((pr) => classifyDay(pr.createdAt) === 'Earlier')
                        .filter(
                          (pr) => pr.title.includes(submissionSearchTerm) || pr.body.includes(submissionSearchTerm)
                        )
                        .map((pr, index) => (
                          <SubmissionCard key={index} pr={pr} />
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
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
  const { nonBlacklisted } = await getNonBlacklisted(appState, name, org, 50);

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
      currentPrs: nonBlacklisted,
    },
  };
}
