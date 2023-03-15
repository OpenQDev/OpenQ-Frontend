import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import HackathonCard from '../HackathonCard';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const Manager = () => {
  const [appState] = useContext(StoreContext);
  const { openQPrismaClient } = appState;
  const [githubRepositories, setGithubRepositories] = useState({});

  const [repositories, setRepositories] = useState();
  useEffect(() => {
    const fetchRepositories = async () => {
      const repositories = await openQPrismaClient.getRepositories();
      setRepositories(repositories);
    };
    fetchRepositories();
  }, []);
  useEffect(() => {
    const repositoryIds = repositories?.map((repository) => repository.id);
    const fetchRepositories = async () => {
      const githubRepositories = await appState.githubRepository.fetchReposByIds(repositoryIds);
      let githubRepositoryIndex = {};
      for (let githubRepository of githubRepositories) {
        githubRepositoryIndex[githubRepository.id] = githubRepository;
      }
      setGithubRepositories({ ...githubRepositoryIndex });
    };
    if (repositoryIds) {
      fetchRepositories();
    }
  }, [repositories]);
  return (
    <>
      {' '}
      {repositories?.map((repository, index) => {
        return (
          <HackathonCard githubRepository={githubRepositories[repository.id]} repository={repository} key={index} />
        );
      })}
    </>
  );
};

export default Manager;
