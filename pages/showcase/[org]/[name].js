// Third party
import React, { useState, useContext } from 'react';
import nookies from 'nookies';

import SearchBar from '../../../components/Search/SearchBar';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import useAuth from '../../../hooks/useAuth';
import SubmissionCard from '../../../components/Submissions/SubmissionCard';
import OrganizationHeader from '../../../components/Organization/OrganizationHeader';
import SubMenu from '../../../components/Utils/SubMenu';
import Home from '../../../components/svg/home';
import Trophy from '../../../components/svg/trophy';
import BountyList from '../../../components/BountyList/BountyList';
import StoreContext from '../../../store/Store/StoreContext';
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import useWeb3 from '../../../hooks/useWeb3';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import Logger from '../../../services/logger/Logger';
import Utils from '../../../services/utils/Utils';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';

const showcase = ({ name, currentPrs, batch, renderError, firstCursor, fullBounties, repoData }) => {
  // oAuthToken?
  // TO DO: get orgData & repoData to fill in info from header + Hackathon Data
  // TO DO: fetch bounties only per that repo
  //Context
  console.log(repoData);
  const [appState] = useContext(StoreContext);
  useAuth();
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState('');
  const [toggleVal, setToggleVal] = useState('Overview');
  const [isLoading, setIsLoading] = useState(false);
  const [complete, setComplete] = useState();
  const [bounties, setBounties] = useState(fullBounties);
  const [offChainCursor, setOffChainCursor] = useState(firstCursor);
  const [error, setError] = useState(renderError);
  const { account } = useWeb3();
  // Render
  const [pagination, setPagination] = useState(batch);
  async function getBountyData(sortOrder, currentPagination, orderBy, cursor) {
    setPagination(() => currentPagination + batch);
    let complete = false;
    try {
      const [fullBounties, newCursor] = await appState.utils.fetchBounties(
        appState,
        batch,
        null,
        sortOrder,
        orderBy,
        cursor,
        organizationData.id,
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
  const handleToggle = (toggleVal) => {
    setToggleVal(toggleVal);
  };
  const filterBySubmission = (e) => {
    setSubmissionSearchTerm(e.target.value);
  };
  async function getNewData(order, orderBy) {
    setIsLoading(true);
    setComplete(false);
    let newBounties = [];
    [newBounties] = await getBountyData(order, 0, orderBy);
    setBounties(newBounties);
    setIsLoading(false);
  }
  async function getMoreData(order, orderBy) {
    setComplete(true);
    const [newBounties, complete] = await getBountyData(order, pagination, orderBy, offChainCursor);
    if (!complete) {
      setComplete(false);
    }
    setBounties(bounties.concat(newBounties));
  }
  //dummy data to remove:
  const organizationData = {
    name: 'OpenQ Labs',
    login: 'OpenQDev',
    description: 'hello world',
    location: 'Github',
    websiteUrl: 'www.myorgwebsite.com',
    twitterUsername: 'OpenQ',
    email: 'email@gmail.com',
    url: 'mywebsite.com',
    avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4',
  };
  //dummy data to remove:
  const repository = {
    name: 'OpenQ-Frontend',
    url: 'www.repo.com',
    description: 'That is my repo description',
    isContest: true,
  };

  return (
    <>
      {error ? (
        <UnexpectedErrorModal error={error} />
      ) : (
        <div className='w-full mx-auto text-primary mt-1 px-4 md:px-16 max-w-[1420px] '>
          <OrganizationHeader organizationData={organizationData} repository={repository}></OrganizationHeader>
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
                  <BountyList
                    contractToggle={true}
                    bounties={bounties}
                    loading={isLoading}
                    getMoreData={getMoreData}
                    complete={complete}
                    getNewData={getNewData}
                    types={['0', '1', '2', '3']}
                  />
                </div>
              </div>
            </>
          )}
          {toggleVal === 'Hackathon Submissions' && (
            <div className='py-3 gap-6 w-full flex flex-col flex-wrap md:flex-nowrap'>
              <div className='  w-full px-2 sm:px-8 flex-wrap max-w-[1028px] pb-8 mx-auto'>
                <h1 className='lsm:text-[32px] text-4xl py-16 flex-1 leading-tight min-w-[240px] pr-20'>
                  Submissions for {name}
                </h1>

                <div className='lg:col-start-2 justify-between justify-self-center space-y-3 w-full pb-8'>
                  <SearchBar
                    onKeyUp={filterBySubmission}
                    searchText={submissionSearchTerm}
                    placeholder='Search Submissions...'
                    styles={''}
                  />
                  <div className='grid gap-8 w-full pt-8 justify-between justify-items-center grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]'>
                    {currentPrs
                      .filter((pr) => pr.title.includes(submissionSearchTerm) || pr.body.includes(submissionSearchTerm))
                      .map((pr, index) => (
                        <SubmissionCard key={index} pr={pr} />
                      ))}
                  </div>
                </div>
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
  const cookies = nookies.get(context);
  const { github_oauth_token_unsigned } = cookies;
  const oauthToken = github_oauth_token_unsigned ? github_oauth_token_unsigned : null;
  githubRepository.instance.setGraphqlHeaders(oauthToken);
  const { org, name } = context.query;
  const currentPrs = await githubRepository.instance.getPrs(org, name);

  const openQSubgraphClient = new WrappedOpenQSubgraphClient();
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const utils = new Utils();
  const logger = new Logger();
  const batch = 10;
  let fullBounties = [];
  let firstCursor = null;
  let renderError = '';
  let repoData;
  try {
    console.log('yay', name, org);
    repoData = await githubRepository.instance.fetchRepoByName(org, name);
  } catch (err) {
    return {
      props: {
        renderError: `Could not find ${name} for the organization ${org} on Github, does this repository and / or organization exist on Github?`,
      },
    };
  }
  console.log(repoData);
  try {
    [fullBounties, firstCursor] = await utils.fetchBounties(
      {
        openQSubgraphClient: openQSubgraphClient.instance,
        githubRepository: githubRepository.instance,
        openQPrismaClient: openQPrismaClient.instance,
        logger,
      },
      batch,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  } catch (err) {
    logger.error(err);
    renderError = JSON.stringify(err);
  }
  return {
    props: {
      fullBounties,
      renderError,
      batch,
      firstCursor,
      oauthToken,
      name,
      currentPrs: currentPrs.data.repository.pullRequests.nodes,
      repoData,
    },
  };
}
