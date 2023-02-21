import React, { createContext, useContext, useState } from 'react';
import { gun } from '../../lib/Gun';
import reposWhitelist from '../../lib/goodFirstIssuesOrgWhitelist.json';

const ReposContext = createContext([]);
const LanguageFilterContext = createContext([]);
const SetLanguageFilterContext = createContext(() => {});

export function useRepos() {
  return useContext(ReposContext);
}

export function useLanguageFilter() {
  return useContext(LanguageFilterContext);
}

export function useSetLanguageFilter() {
  return useContext(SetLanguageFilterContext);
}

export function ReposProvider({ children }) {
  const [repos, setRepos] = useState([]);

  reposWhitelist.forEach((ownerAndRepo) => {
    gun.get(ownerAndRepo).once((repo) => {
      if (!repo || !repo.id) return;

      setRepos((repos) => {
        const index = repos.findIndex((r) => r.id === repo.id);
        if (index === -1) {
          return [...repos, repo];
        } else {
          return [...repos.slice(0, index), repo, ...repos.slice(index + 1)];
        }
      });
    });
  });

  const [enabledLanguages, setEnabledLanguages] = useState([]);

  return (
    <ReposContext.Provider value={repos}>
      <LanguageFilterContext.Provider value={enabledLanguages}>
        <SetLanguageFilterContext.Provider value={setEnabledLanguages}>{children}</SetLanguageFilterContext.Provider>
      </LanguageFilterContext.Provider>
    </ReposContext.Provider>
  );
}
