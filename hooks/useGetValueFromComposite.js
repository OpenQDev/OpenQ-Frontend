import { useState, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';
import useAsync from './useAsync';

const useGetValueFromComposite = (address, volume) => {
  const [tokenValues, setTokenValues] = useState(null);
  const [appState] = useContext(StoreContext);

  const getParsedTokenValues = async () => {
    const tokenBalance = { tokenAddress: address, volume: volume };
    if (JSON.stringify(tokenBalance) !== '{}' && tokenBalance) {
      try {
        const value = await appState.tokenClient.parseTokenValues(tokenBalance);

        return value;
      } catch (err) {
        console.log(err);
      }
    }
    if (tokenBalance?.length === 0) {
      return { total: 0 };
    }
  };
  useAsync(getParsedTokenValues, setTokenValues, [address, volume]);
  return [tokenValues, setTokenValues];
};

export default useGetValueFromComposite;
