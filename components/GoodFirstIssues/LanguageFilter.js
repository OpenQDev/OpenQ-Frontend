import React from 'react';
import { useRepos } from '../../store/Gun/ReposProvider';
import LanguageFilterLanguage from './LanguageFilterLanguage';

export default function LanguageFilter() {
  const repos = useRepos();

  const languages =
    repos?.reduce((result, repo) => {
      if (repo.language) {
        if (result[repo.language]) {
          result[repo.language]++;
        } else {
          result[repo.language] = 1;
        }
      }
      return result;
    }, {}) || {};

  return (
    <div className='flex flex-wrap mt-3 gap-2'>
      {Object.entries(languages).map(([name, count]) => (
        <LanguageFilterLanguage key={name} name={name} count={count} />
      ))}
    </div>
  );
}
