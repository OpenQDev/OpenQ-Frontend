import React, { useEffect, useState } from 'react';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import WrappedGithubRepository from '../../../services/github/WrappedGithubClient';
import HackathonHeading from '../../../components/Hackathon/HackathonHeading';
import PanelWithMetadata from '../../../components/Layout/PanelWithMetadata';
import ViewHeading from '../../../components/Hackathon/ViewHeading';
import ViewBody from '../../../components/Hackathon/ViewBody';
import HackathonMetadata from '../../../components/Hackathon/HackathonMetadata';

const Hackathon = ({ githubRepository, repository }) => {
  const internalMenuState = useState('View');

  useEffect(() => {
    console.log(githubRepository, repository);
  });
  return (
    <div className='pt-4'>
      <HackathonHeading internalMenuState={internalMenuState} repository={repository} />
      <div className='flex justify-between  w-full px-2 sm:px-8  max-w-[1200px] pb-4 mx-auto'>
        <ViewHeading />
      </div>
      <PanelWithMetadata>
        <ViewBody />
        <HackathonMetadata />
      </PanelWithMetadata>
    </div>
  );
};
export default Hackathon;

export const getServerSideProps = async (context) => {
  const repositoryId = context.query.id;
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const repository = await openQPrismaClient.instance.getRepositoryById(repositoryId);
  const githubClient = new WrappedGithubRepository();
  console.log(githubClient);
  const githubRepository = null; //await githubClient.instance.fetchRepoById(repositoryId);
  console.log(repositoryId, repository, githubRepository);
  return {
    props: { githubRepository, repository },
  };
};
314074269;
