import React from 'react';
import { useOrgs } from '../../store/Store/GoodFirstIssuesProvider';
import LanguageFilterLanguage from './LanguageFilterLanguage';

export default function LanguageFilter() {
  const orgs = useOrgs();

  const languages = Object.values(orgs)
    .flatMap((org) => org.repositories)
    .reduce((result, repo) => {
      if (repo.languages[0]) {
        const languageName = repo.languages[0].name;
        if (result[languageName]) {
          result[languageName]++;
        } else {
          result[languageName] = 1;
        }
      }
      return result;
    }, {});

  return (
    <div className='flex flex-wrap mt-3 gap-2 min-w-[16rem]'>
      {Object.entries(languages).map(([name, count]) => (
        <LanguageFilterLanguage key={name} name={name} count={count} />
      ))}
    </div>
  );
}
