import React, { useEffect, useContext } from 'react';
import StoreContext from '../Store/StoreContext';
import useAuth from '../../hooks/useAuth';

// manages shared state between auth context and store context
const SetContextState = (props) => {
  const [authState] = useAuth();
  const [appState, dispatch] = useContext(StoreContext);
  // saves github and account data to openq-api
  useEffect(() => {
    const checkGithub = async () => {
      if (authState.githubId || authState.email) {
        console.log('Exec');
        const { githubId, email } = authState;
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
            ...(github && { github }),
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
  }, [authState]);

  return <>{props.children}</>;
};

export default SetContextState;
