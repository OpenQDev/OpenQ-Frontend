// Third party
import React, { useState } from 'react';
import nookies from 'nookies';

import SearchBar from '../../../components/Search/SearchBar';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import SubmissionCard from '../../../components/Submissions/SubmissionCard';
import { getNonBlacklisted } from '../../../services/utils/lib';

const showcase = ({ name, currentPrs }) => {
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState('');
  // Render
  const filterBySubmission = (e) => {
    setSubmissionSearchTerm(e.target.value);
  };

  return (
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
  );
};
export default showcase;

export async function getServerSideProps(context) {
  const wrappedGithubRepository = new WrappedGithubClient();
  const githubRepository = wrappedGithubRepository.instance;
  const wrappedOpenQPrismaClient = new WrappedOpenQPrismaClient();
  const openQPrismaClient = wrappedOpenQPrismaClient.instance;

  const { org, name } = context.query;

  const { nonBlacklisted } = await getNonBlacklisted({ githubRepository, openQPrismaClient }, name, org, 100);

  return {
    props: { name, org, currentPrs: nonBlacklisted }, // will be passed to the page component as props
  };
}
