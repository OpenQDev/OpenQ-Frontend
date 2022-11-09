import { useEffect, useContext } from 'react';
import AuthContext from '../store/AuthStore/AuthContext';
import axios from 'axios';
import useWeb3 from './useWeb3';
import StoreContext from '../store/Store/StoreContext';
import { ethers } from 'ethers';
import ReactGA from 'react-ga4';
import { useRouter } from 'next/router';
const useAuth = () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [appState] = useContext(StoreContext);
  const { reloadNow } = appState;
  const { account } = useWeb3();
  const router = useRouter();
  useEffect(() => {
    const checkGithub = async () => {
      if (Object.prototype.hasOwnProperty.call(authState, 'login') && account) {
        const accountData = await appState.openQPrismaClient.getUser(account);

        if (!accountData?.github) {
          const githubLogin = authState.login;
          const params = {
            address: ethers.utils.getAddress(account),
            ...(githubLogin && { github: githubLogin }),
          };
          await appState.openQPrismaClient.updateUserSimple(params);
        }
      }
    };
    checkGithub();
  }, [authState, account]);

  useEffect(() => {
    let didCancel;
    async function checkAuth(didCancel) {
      axios
        .get(`${process.env.NEXT_PUBLIC_AUTH_URL}/checkAuth`, {
          withCredentials: true,
        })
        .then((res) => {
          if (!didCancel) {
            setAuthState({
              type: 'UPDATE_IS_AUTHENTICATED',
              payload: {
                isAuthenticated: res.data.isAuthenticated,
                avatarUrl: res.data.avatarUrl,
                login: res.data.login,
                githubId: res.data.githubId,
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
  }, [router?.asPath]);

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
