import React, { useEffect, useState } from 'react';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient.js';
import ManageUserGroup from '../../../components/Pro/TeamAccountPage/ManageUserGroup';
import SuperchargingHackathons from '../../../components/Pro/SuperchargingHackathons/index.js';

import ProProvider from '../../../components/Pro//TeamAccountPage/ProProvider';
import PageHeader from '../../../components/PageHeader/index.js';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Manager from '../../../components/Manager/index.js';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient.js';

const TeamAccount = ({ teamAccount, repositories }) => {
  const hasSuperchargedHackathons = teamAccount?.permissionedProducts?.nodes?.some(
    (node) => node.name === 'SuperchargingHackathonsProduct'
  );
  const [searchText, setSearchText] = useState('');
  const HACKATHONS = 'Hackathons';
  const TEAM = 'Team';
  const menuState = useState(TEAM);
  const { query } = useRouter();

  const [internalMenu, setInternalMenu] = menuState;
  useEffect(() => {
    setInternalMenu(query?.tab || TEAM);
  }, []);
  const titleLine = {
    [HACKATHONS]: {
      Title: () => <>Create Your Hackathon</>,
      SubTitle: () => (
        <>
          Learn more about our hackathon platform{' '}
          <Link className='hover:underline text-link-colour' href={'https://openq.dev'}>
            here
          </Link>
          .
        </>
      ),
      CTAButton: ({ styles }) => {
        return (
          <>
            <Link
              href={`/pro/${query.id}/createHackathon`}
              className={`lg:col-start-4 col-span-4 lg:col-span-1 whitespace-nowrap btn-primary flex flex-row space-x-3 items-center justify-center leading-tight h-min sm:w-min px-3 ${styles}`}
            >
              <div>Create Hackathon</div>
            </Link>
          </>
        );
      },
    },
    [TEAM]: {
      Title: () => <>Manage the {teamAccount.name} Team</>,
      SubTitle: () => (
        <>
          Learn more about our hackathon platform{' '}
          <Link className='hover:underline text-link-colour' href={'https://openq.dev'}>
            here
          </Link>
          .
        </>
      ),
      CTAButton: () => {
        return <></>;
      },
    },
  };
  const hackathonMenuItem = hasSuperchargedHackathons ? [{ name: HACKATHONS }] : [{}];
  const items = [...hackathonMenuItem, { name: TEAM }];
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };
  const searchedRepos = repositories.filter((repository) => {
    return repository.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <>
      <PageHeader
        CTAButton={titleLine[internalMenu].CTAButton}
        menuState={menuState}
        titleLine={titleLine[internalMenu]}
        items={items}
        hasSearch={internalMenu === 'Hackathons'}
        searchText={searchText}
        handleSearchInput={handleSearchInput}
      >
        {internalMenu === 'Hackathons' && <Manager repositories={searchedRepos} />}
        {internalMenu === 'Team' && (
          <ProProvider teamAccount={teamAccount}>
            <div className='w-full flex flex-col gap-y-4 relative flex-1  min-w-[260px]'>
              <ManageUserGroup groupName={'Owner(s)'} groupKey='ownerUsers' teamAccount={teamAccount} />

              <ManageUserGroup groupName={'Admins'} groupKey='adminUsers' teamAccount={teamAccount} />
              {teamAccount.permissionedProducts.nodes.some(
                (node) => node.name === 'SuperchargingHackathonsProduct'
              ) && <SuperchargingHackathons teamAccount={teamAccount} />}
            </div>
          </ProProvider>
        )}
      </PageHeader>
    </>
  );
};

export default TeamAccount;

export const getServerSideProps = async (context) => {
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const githubRepository = new WrappedGithubClient();

  await openQPrismaClient.instance.setGraphqlHeaders(context.req.headers.cookie);
  const { id } = context.query;
  const { teamAccount } = await openQPrismaClient.instance.getTeamAccount(id);
  const { repositories } = teamAccount.hackathonProductInstances.nodes[0];
  const repositoryIds = repositories.nodes?.map((repository) => repository.id);
  const githubRepositories = await githubRepository.instance.fetchReposByIds(repositoryIds);
  let githubRepositoryIndex = {};
  for (let githubRepository of githubRepositories) {
    githubRepositoryIndex[githubRepository.id] = githubRepository;
  }
  const combinedRepo = repositories.nodes.map((repository) => {
    return {
      ...repository,
      ...githubRepositoryIndex[repository.id],
    };
  });
  return {
    props: {
      teamAccount,
      repositories: combinedRepo,
    },
  };
};
