import React from 'react';
import WrappedGithubClient from '../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../services/openq-api/WrappedOpenQPrismaClient';
import Utils from '../services/utils/Utils';
import Logger from '../services/logger/Logger';
import UnexpectedErrorModal from '../components/Utils/UnexpectedErrorModal';
import ExploreHeader from '../components/Explore/Header';
import ExploreHackathons from '../components/Explore/Hackathons';
import ExploreMarketplace from '../components/Explore/Marketplace';
import ExploreGoodFirstIssues from '../components/Explore/GoodFirstIssues';
import ExploreNewsletter from '../components/Explore/Newsletter';
import ExploreBlog from '../components/Explore/Blog';
import { fetchRepositories } from '../services/utils/lib';

export default function Index({ nonContestBounties, contestRepositories, renderError }) {
  return (
    <main className='bg-dark-mode flex-col explore'>
      {renderError ? (
        <UnexpectedErrorModal error={renderError} />
      ) : (
        <>
          <ExploreHeader />
          <div className='flex flex-col items-center max-w-screen-2xl mx-auto px-4 md:px-12 lg:px-24 z-[1] relative'>
            <ExploreHackathons fullContests={contestRepositories} />
            <ExploreMarketplace fullBounties={nonContestBounties} />
            <ExploreGoodFirstIssues />
            <ExploreNewsletter />
            <ExploreBlog />
          </div>
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
  let nonContestBounties = [];
  let renderError = '';
  const appState = {
    openQSubgraphClient: openQSubgraphClient.instance,
    githubRepository: githubRepository.instance,
    openQPrismaClient: openQPrismaClient.instance,
    logger,
  };

  const contestRepositories = await fetchRepositories(appState, { contestOnly: true });

  try {
    [nonContestBounties] = await utils.fetchBounties(appState, batch, ['0', '1']);
  } catch (err) {
    logger.error(err, null, '[index]3.js');
    renderError = JSON.stringify(err);
  }

  return {
    props: {
      contestRepositories,
      nonContestBounties,
      renderError,
    },
  };
};
