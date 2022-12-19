import { useEffect, useContext } from 'react';
import AuthContext from '../store/AuthStore/AuthContext';
import useWeb3 from './useWeb3';
import StoreContext from '../store/Store/StoreContext';
import ReactGA from 'react-ga4';

const useAuth = (state) => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [appState] = useContext(StoreContext || state);
  const { account } = useWeb3();
  const { accountData } = appState;

  useEffect(() => {
    let didCancel;

    async function checkAuth(didCancel) {
      appState.authService
        .checkAuth()
        .then((data) => {
          if (!didCancel) {
            setAuthState({
              type: 'UPDATE_IS_AUTHENTICATED',
              payload: {
                isAuthenticated: data.payload.isAuthenticated,
                avatarUrl: data.payload.avatarUrl,
                login: data.payload.login,
                githubId: data.payload.githubId,
                email: data.payload.email,
              },
            });
          }
        })
        .catch((err) => {
          appState.logger.error(err, accountData.id, 'useAuth1');
        });
    }

    if (process.env.NEXT_PUBLIC_DEPLOY_ENV !== 'local') {
      checkAuth(didCancel);
    }

    () => (didCancel = true);
  }, []);

  useEffect(() => {
    if (account) {
      const logAuth = () => {
        ReactGA.event({
          category: 'CONNECT_WALLET',
          action: 'CONNECT_WALLET',
          label: 'address:'.concat(account),
        });
      };

      //  appState.openQPrismaClient.add(account);
      logAuth();
    }
  }, [account]);

  return [authState, setAuthState];
};

export default useAuth;
