import React from 'react';
import { useLanguageFilter, useRepos } from '../../store/Store/GoodFirstIssuesProvider';
import RepoCard from './RepoCard';

export default function TheList() {
  const repos = useRepos();
  const enabledLanguages = useLanguageFilter();

  const filteredRepos =
    repos?.filter(
      (repo) => enabledLanguages.length === 0 || enabledLanguages.includes(repo.languages.nodes[0]?.name)
    ) || [];

  return (
    <main className='px-6 py-6 space-y-4 grow'>
      {filteredRepos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </main>
  );
}
