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
        console.log('Exec');
        const idObj = githubId ? { github: githubId } : { email };
        console.log(idObj, 'there');
        const accountData = await appState.openQPrismaClient.getUser(idObj);
        dispatch({ payload: accountData, type: 'UPDATE_ACCOUNTDATA' });

        if (!accountData?.languages && !accountData?.twitter && authState.githubId) {
          const githubUser = await appState.githubRepository.fetchUserById(authState.githubId);
          const github = authState.githubId;
          let twitter = '';
          if (githubUser.twitterUsername) {
            twitter = `https://twitter.com/${githubUser.twitterUsername}`;
          }
          const languages = githubUser.recentLanguages;
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
    console.log(authState, accountData);

    const combineUsers = async () => {
      console.log('combined users');
      const value = await appState.openQPrismaClient.combineUsers({
        email: authState.email,
        github: authState.githubId,
      });
      console.log(value);
    };
    if (authState.email && authState.githubId && accountData.email !== email && accountData.github === githubId) {
      combineUsers();
    }
  }, [authState.githubId, authState.email, accountData.github, accountData.email]);

  return <>{props.children}</>;
};

export default SetContextState;
