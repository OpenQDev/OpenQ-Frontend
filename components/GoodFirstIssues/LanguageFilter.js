import React from 'react';
import { useRepos } from '../../store/Store/GoodFirstIssuesProvider';
import LanguageFilterLanguage from './LanguageFilterLanguage';

export default function LanguageFilter() {
  const repos = useRepos();

  const languages =
    repos?.reduce((result, repo) => {
      if (repo.languages.nodes.length > 0) {
        const languageName = repo.languages.nodes[0].name;
        if (result[languageName]) {
          result[languageName]++;
        } else {
          result[languageName] = 1;
        }
      }
      return result;
    }, {}) || {};

  return (
    <div className='flex flex-wrap mt-3 gap-2 min-w-[16rem]'>
      {Object.entries(languages).map(([name, count]) => (
        <LanguageFilterLanguage key={name} name={name} count={count} />
      ))}
    </div>
  );
}
