import { useState, useEffect, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';
function useAsync(asyncFn, onSuccess, deps) {
  useEffect(() => {
    let isActive = true;
    asyncFn().then((data) => {
      if (isActive) {
        onSuccess(data);
      }
    });
    return () => {
      isActive = false;
    };
  }, [onSuccess, deps]);
}
const useGetTokenValues = (tokenBalances) => {
  const [tokenValues, setTokenValues] = useState(null);
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;

  const getParsedTokenValues = async () => {
    if (JSON.stringify(tokenValues) !== '{}' && tokenBalances) {
      try {
        const value = await appState.tokenClient.parseTokenValues(tokenBalances);
        return value;
      } catch (err) {
        appState.logger.error({ message: err }, accountData.id, 'useGetTokenValues1');
      }
    }
    if (tokenBalances?.length === 0) {
      return { total: 0 };
    }
  };
  useAsync(getParsedTokenValues, setTokenValues, tokenBalances);

  return [tokenValues, setTokenValues];
};

export default useGetTokenValues;
