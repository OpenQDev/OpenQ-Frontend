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
    console.log('waiting on useEffecrt');

    async function checkAuth(didCancel) {
      console.log('check auth');
      appState.authService
        .checkAuth()
        .then((data) => {
          if (!didCancel) {
            console.log("you don't see me");
            console.log(
              {
                type: 'UPDATE_IS_AUTHENTICATED',
                payload: {
                  isAuthenticated: data.isAuthenticated,
                  avatarUrl: data.avatar_url,
                  login: data.login,
                  githubId: data.node_id,
                  email: data.email,
                },
              },
              'data'
            );
            setAuthState({
              type: 'UPDATE_IS_AUTHENTICATED',
              payload: {
                isAuthenticated: data.isAuthenticated,
                avatarUrl: data.avatar_url,
                login: data.login,
                githubId: data.node_id,
                email: data.email,
              },
            });
          }
        })
        .catch((err) => {
          appState.logger.error(err, accountData.id, 'useAuth1');
        });
    }

    if (process.env.NEXT_PUBLIC_DEPLOY_ENV === 'local') {
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
