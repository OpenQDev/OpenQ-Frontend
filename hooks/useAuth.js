import { useEffect, useContext } from 'react';
import AuthContext from '../store/AuthStore/AuthContext';
import useWeb3 from './useWeb3';
import StoreContext from '../store/Store/StoreContext';
import ReactGA from 'react-ga4';

const useAuth = (state) => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [appState] = useContext(StoreContext || state);
  const { reloadNow } = appState;
  const { account } = useWeb3();

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
              },
            });
          }
        })
        .catch((err) => {
          appState.logger.error(err, account, 'useAuth1');
        });
    }

    if (process.env.NEXT_PUBLIC_DEPLOY_ENV !== 'local') {
      checkAuth(didCancel);
    }

    () => (didCancel = true);
  }, []);

  // runs whenever backend changes or account changes.
  useEffect(() => {
    let didCancel;
    // updates signed account if recieves true.
    async function checkAccount() {
      try {
        const response = await appState.authService.hasSignature(account);
        if (response.data.status && !didCancel) {
          setAuthState({
            type: 'UPDATE_SIGNED_ACCOUNT',
            payload: { addressRecovered: response.data.addressRecovered, isAdmin: response.data.admin },
          });
        }
      } catch (err) {
        appState.logger.error(err);
      }
    }

    if (account) {
      checkAccount();
    }

    () => (didCancel = true);
  }, [account, reloadNow]);

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
