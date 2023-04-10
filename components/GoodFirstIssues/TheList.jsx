import React from 'react';
import { useLanguageFilter, useOrgs } from '../../store/Store/GoodFirstIssuesProvider';
import RepoCard from './RepoCard';

export default function TheList() {
  const orgs = useOrgs();
  const enabledLanguages = useLanguageFilter();

  const repos = Object.values(orgs)
    .flatMap((org) => org.repositories)
    .sort(() => Math.random() - 0.5);

  const filteredRepos =
    repos?.filter((repo) => enabledLanguages.length === 0 || enabledLanguages.includes(repo.languages[0]?.name)) || [];

  return (
    <main className='px-6 py-6 space-y-4 grow'>
      {filteredRepos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </main>
  );
}
