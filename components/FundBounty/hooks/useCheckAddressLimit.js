import { useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import FundContext from '../FundContext';
import useWeb3 from '../../../hooks/useWeb3';

const useCheckAddressLimit = () => {
  const [appState] = useContext(StoreContext);
  const [fundState, fundDispatch] = useContext(FundContext);
  const { bounty, token } = fundState;
  const { library } = useWeb3();
  const { openQClient } = appState;
  const checkAddressLimit = async () => {
    try {
      const isWhitelisted = await openQClient.isWhitelisted(library, token.address);

      // Only check bounty token address limit for non-whitelisted tokens
      if (!isWhitelisted) {
        const tokenAddressLimitReached = await openQClient.tokenAddressLimitReached(library, bounty.bountyAddress);
        if (tokenAddressLimitReached) {
          const error = {
            title: 'Token Address Limit Is Reached!',
            message: 'Contact info@openq.dev',
          };

          const errorDispatch = {
            type: 'SET_ERROR',
            id: 'useCheckAddressLimit1',
            payload: error,
          };
          fundDispatch(errorDispatch);
          return;
        }
      }
    } catch (error) {
      const errorDispatch = {
        type: 'SET_ERROR',
        id: 'useCheckAddressLimit2',
        payload: error,
      };
      fundDispatch(errorDispatch);
      return;
    }
  };
  return checkAddressLimit;
};

export default useCheckAddressLimit;
