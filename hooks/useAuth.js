import { useEffect, useContext } from 'react';
import AuthContext from '../store/AuthStore/AuthContext';
import axios from 'axios';
import useWeb3 from './useWeb3';
import StoreContext from '../store/Store/StoreContext';

const useAuth = () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [appState] = useContext(StoreContext);
  const { reloadNow } = appState;
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
              },
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (process.env.NEXT_PUBLIC_DEPLOY_ENV !== 'local') {
      checkAuth(didCancel);
    }
    () => (didCancel = true);
  }, []);
  const { account } = useWeb3();

  // runs whenever backend changes or account changes.
  useEffect(async () => {
    let didCancel;
    // updates signed account if recieves true.
    async function checkAccount() {
      const response = await appState.authService.hasSignature(account);
      if (response.data.status && !didCancel) {
        setAuthState({
          type: 'UPDATE_SIGNED_ACCOUNT',
          payload: { addressRecovered: response.data.addressRecovered },
          isAdmin: response.data.admin,
        });
      }
    }
    if (account) {
      await checkAccount();
    }
    () => (didCancel = true);
  }, [account, reloadNow]);

  return [authState, setAuthState];
};

export default useAuth;
