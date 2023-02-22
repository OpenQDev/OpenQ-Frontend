import React, { createContext, useContext, useEffect, useState } from "react";
import StoreContext from './StoreContext';
import { gun } from '../../lib/Gun';
import goodFirstIssuesOrgWhitelist from '../../lib/goodFirstIssuesOrgWhitelist.json';

const ReposContext = createContext([]);
const IssuesContext = createContext([]);
const LanguageFilterContext = createContext([]);
const SetLanguageFilterContext = createContext(() => {});

export function useRepos() {
  return useContext(ReposContext);
}

export function useIssues() {
  return useContext(IssuesContext);
}

export function useLanguageFilter() {
  return useContext(LanguageFilterContext);
}

export function useSetLanguageFilter() {
  return useContext(SetLanguageFilterContext);
}

async function syncOrgOrUserToGun(orgOrUserName, githubClient) {
  const githubOrgOrUserRepoNames = await githubClient.fetchOrgOrUserRepoNames(orgOrUserName);

  for (const githubRepoName of githubOrgOrUserRepoNames) {
    const repo = await githubClient.fetchRepoWithLabeledIssues(
      orgOrUserName,
      githubRepoName,
      [ 'good first issue' ]
    );
    
    repo.issues.nodes.forEach(issue => {
      const updatedIssue = { ...issue };
      updatedIssue.repository = {
        ...repo,
        issues: undefined,
      };
      const gunIssue = gun.get('goodfirstissues').get(updatedIssue.id);
      gunIssue.put(JSON.stringify(updatedIssue));
    });
  }
}

export function GoodFirstIssuesProvider({ children }) {
  const [appState] = useContext(StoreContext);
  const [repos, setRepos] = useState([]);
  const [issues, setIssues] = useState([]);
  const [enabledLanguages, setEnabledLanguages] = useState([]);
  const NUMBER_OF_RANDOMLY_UPDATE_ORGS = 1;

  useEffect(() => {
    const shuffledOrgWhitelist = goodFirstIssuesOrgWhitelist.sort(() => 0.5 - Math.random());
    for (const orgName of shuffledOrgWhitelist.slice(0, NUMBER_OF_RANDOMLY_UPDATE_ORGS)) {
      syncOrgOrUserToGun(orgName, appState.githubRepository);
    }
  }, []);

  gun.get('goodfirstissues').load((issues) => {
    for (const issue of Object.values(issues)) {
      const parsedIssue = JSON.parse(issue);
      setIssues(issues => {
        if (issues.find(issue => issue.id === parsedIssue.id)) {
          return issues;
        }
  
        setRepos(repos => {
          // shuffle repos
          const shuffledRepos = repos.sort(() => 0.5 - Math.random());
          if (shuffledRepos.find(repo => repo.id === parsedIssue.repository.id)) {
            return shuffledRepos;
          }
    
          return [...shuffledRepos, parsedIssue.repository]
        });
  
        return [...issues, parsedIssue]
      });
    }
  })

  return (
    <ReposContext.Provider value={repos}>
      <IssuesContext.Provider value={issues}>
        <LanguageFilterContext.Provider value={enabledLanguages}>
          <SetLanguageFilterContext.Provider value={setEnabledLanguages}>
            {children}
          </SetLanguageFilterContext.Provider>
        </LanguageFilterContext.Provider>
      </IssuesContext.Provider>
    </ReposContext.Provider>
  )
}
