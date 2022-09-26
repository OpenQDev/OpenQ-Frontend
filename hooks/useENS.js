import { useState, useEffect, useContext } from 'react';

import StoreContext from '../store/Store/StoreContext';

const useEns = (account) => {
  const [appState] = useContext(StoreContext);
  const [ensName, setEnsName] = useState();
  useEffect(async () => {
    let didCancel;
    if (account) {
      const localEns = sessionStorage.getItem(`${account}:ens`);
      if (localEns !== 'false') {
        if (localEns && !didCancel) {
          setEnsName(localEns);
        } else {
          const fetchedEnsName = await appState.openQClient.getENS(account);
          sessionStorage.setItem(`${account}:ens`, fetchedEnsName);
          if (!didCancel) {
            setEnsName(fetchedEnsName && fetchedEnsName);
          }
        }
      }
    }
    return () => (didCancel = true);
  }, [account]);

  return [ensName, setEnsName];
};

export default useEns;
