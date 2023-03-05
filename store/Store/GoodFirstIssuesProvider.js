import React, { createContext, useContext, useEffect, useState } from 'react';

const OrgsContext = createContext([]);
const LanguageFilterContext = createContext([]);
const SetLanguageFilterContext = createContext(() => {});

export function useOrgs() {
  return useContext(OrgsContext);
}

export function useLanguageFilter() {
  return useContext(LanguageFilterContext);
}

export function useSetLanguageFilter() {
  return useContext(SetLanguageFilterContext);
}

export function GoodFirstIssuesProvider({ children }) {
  const [orgs, setOrgs] = useState([]);
  const [enabledLanguages, setEnabledLanguages] = useState([]);

  useEffect(() => {
    fetch('https://gfw3i.mktcode.uber.space').then((res) => res.json()).then((orgs) => {
      setOrgs(orgs)
    });
  }, []);

  return (
    <OrgsContext.Provider value={orgs}>
      <LanguageFilterContext.Provider value={enabledLanguages}>
        <SetLanguageFilterContext.Provider value={setEnabledLanguages}>{children}</SetLanguageFilterContext.Provider>
      </LanguageFilterContext.Provider>
    </OrgsContext.Provider>
  );
}
