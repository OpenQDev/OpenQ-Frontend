import useEagerConnect from './useEagerConnect';
import StoreContext from '../store/Store/StoreContext';
import { useContext } from 'react';

const useConnectOnLoad = () => {
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  if (process.env.NEXT_PUBLIC_DEPLOY_ENV == 'local') {
    return () => {
      appState.logger.info('Not connecting on load because local', accountData.id, 'useAuth1');
    };
  } else {
    return useEagerConnect;
  }
};

export default useConnectOnLoad;
