import React, { useEffect, useState } from 'react';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient.js';
import WrappedGithubClient from '../../services/github/WrappedGithubClient.js';
import PageHeader from '../../components/PageHeader/index.js';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Manager from '../../components/Manager/index.js';

const Hackathons = ({ proAccount, githubRepositoryIndex, repositories }) => {
  const hasSuperchargedHackathons = proAccount?.permissionedProducts?.nodes?.some(
    (node) => node.name === 'SuperchargingHackathonsProduct'
  );
  const [searchText, setSearchText] = useState('');
  const HACKATHONS = 'Hackathons';
  const menuState = useState(HACKATHONS);
  const { query } = useRouter();

  const [internalMenu, setInternalMenu] = menuState;
  useEffect(() => {
    setInternalMenu(query?.tab || HACKATHONS);
  }, []);
  const titleLine = {
    [HACKATHONS]: {
      Title: () => <>Browse Hackathons</>,
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
  const items = [...hackathonMenuItem];
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };
  const searchedRepos = repositories
    .map((repository) => {
      return {
        ...repository,
        ...githubRepositoryIndex[repository.id],
      };
    })
    .filter((repository) => {
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
      </PageHeader>
    </>
  );
};

export default Hackathons;

export const getServerSideProps = async (context) => {
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const githubRepository = new WrappedGithubClient();
  await openQPrismaClient.instance.setGraphqlHeaders(context.req.headers.cookie);
  const id = '641acf73213807d5f177fe7d';

  const repositories = await openQPrismaClient.instance.getRepositories({ proContestsOnly: true });
  const repositoryIds = repositories?.map((repository) => repository.id);
  const githubRepositories = await githubRepository.instance.fetchReposByIds(repositoryIds);
  let githubRepositoryIndex = {};
  for (let githubRepository of githubRepositories) {
    githubRepositoryIndex[githubRepository.id] = githubRepository;
  }
  const { proAccount } = await openQPrismaClient.instance.getProAccount(id);
  return {
    props: {
      proAccount,
      githubRepositoryIndex,
      repositories,
    },
  };
};
