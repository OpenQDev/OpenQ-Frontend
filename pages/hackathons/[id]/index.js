import React, { useState } from 'react';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import WrappedGithubRepository from '../../../services/github/WrappedGithubClient';
import HackathonHeading from '../../../components/Hackathon/HackathonHeading';
import PanelWithMetadata from '../../../components/Layout/PanelWithMetadata';
import ViewHeading from '../../../components/Hackathon/ViewHeading';
import ViewBody from '../../../components/Hackathon/ViewBody';
import HackathonMetadata from '../../../components/Hackathon/HackathonMetadata';
import ViewHackathonBounties from '../../../components/Hackathon/ViewHackathonBounties/index.js';

const Hackathon = ({ githubRepository, hackathon }) => {
  const internalMenuState = useState('View');
  const [internalMenu] = internalMenuState;

  return (
    <div className='pt-4'>
      <HackathonHeading internalMenuState={internalMenuState} githubRepository={githubRepository} />
      <div className='flex justify-between  w-full px-2 sm:px-8  max-w-[1200px] pb-4 mx-auto'>
        <ViewHeading hackathon={hackathon} />
      </div>
      <PanelWithMetadata>
        {internalMenu === 'View' && <ViewBody githubRepository={githubRepository} hackathon={hackathon} />}
        {internalMenu === 'Bounties' && (
          <ViewHackathonBounties githubRepository={githubRepository} hackathon={hackathon} />
        )}
        <HackathonMetadata githubRepository={githubRepository} hackathon={hackathon} />
      </PanelWithMetadata>
    </div>
  );
};
export default Hackathon;

export const getServerSideProps = async (context) => {
  const repositoryId = context.query.id;
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const hackathon = await openQPrismaClient.instance.getRepositoryById(repositoryId);
  const githubClient = new WrappedGithubRepository();
  const githubRepository = await githubClient.instance.fetchRepoById(repositoryId);
  return {
    props: { githubRepository, hackathon },
  };
};
