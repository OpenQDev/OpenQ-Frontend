import React, { useEffect, useContext } from 'react';
import StoreContext from '../Store/StoreContext';
import useAuth from '../../hooks/useAuth';

// manages shared state between auth context and store context
const SetContextState = (props) => {
  const [authState] = useAuth();
  const [appState, dispatch] = useContext(StoreContext);
  const { accountData } = appState;
  const { githubId, email } = authState;
  // saves github and account data to openq-api
  useEffect(() => {
    const checkGithub = async () => {
      if (githubId || email) {
        const accountData = await appState.openQPrismaClient.getUser();
        if (accountData) {
          dispatch({ payload: accountData, type: 'UPDATE_ACCOUNT_DATA' });
        }
        if (!accountData?.languages && !accountData?.twitter && authState.githubId) {
          const githubUser = await appState.githubRepository.fetchUserById(authState.githubId);
          const github = authState.githubId;
          let twitter = '';
          if (githubUser.twitterUsername) {
            twitter = `https://twitter.com/${githubUser.twitterUsername}`;
          }
          const languages = githubUser?.recentLanguages;
          const params = {
            ...(github && { github: githubId }),
            ...(twitter && { twitter }),
            ...(languages && { languages }),
          };

          // get github profile by login

          await appState.openQPrismaClient.updateUser(params);
        }
      }
    };
    if (authState) {
      checkGithub();
    }
  }, [authState.email, authState.githubId]);
  useEffect(() => {
    const combineUsers = async () => {
      await appState.openQPrismaClient.combineUsers({
        email: authState.email,
        github: authState.githubId,
      });
    };
    if (authState.email && authState.githubId && accountData.email !== email && accountData.github === githubId) {
      combineUsers();
    }
  }, [authState.githubId, authState.email, accountData.github, accountData.email]);

  return <>{props.children}</>;
};

export default SetContextState;
