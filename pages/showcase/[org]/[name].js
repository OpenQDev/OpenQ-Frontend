// Third party
import React, { useState } from 'react';
import nookies from 'nookies';

import SearchBar from '../../../components/Search/SearchBar';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import useAuth from '../../../hooks/useAuth';
import SubmissionCard from '../../../components/Submissions/SubmissionCard';
import OrganizationHeader from '../../../components/Organization/OrganizationHeader';
import SubMenu from '../../../components/Utils/SubMenu';
import Home from '../../../components/svg/home';
import Trophy from '../../../components/svg/trophy';

const showcase = ({ name, currentPrs }) => {
  useAuth();
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState('');
  const [toggleVal, setToggleVal] = useState('Overview');
  // Render
  const handleToggle = (toggleVal) => {
    setToggleVal(toggleVal);
  };
  const filterBySubmission = (e) => {
    setSubmissionSearchTerm(e.target.value);
  };
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
  return {
    props: { name, org, currentPrs: currentPrs.data.repository.pullRequests.nodes }, // will be passed to the page component as props
  };
}
