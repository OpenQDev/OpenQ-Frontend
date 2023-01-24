import React, { useContext, useState, useEffect } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import AuthContext from '../../store/AuthStore/AuthContext';

// Custom
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import Logger from '../../services/logger/Logger';
import Centered from '../../components/Layout/Centered';
import RequestPage from '../../components/Requests/RequestPage/index.js';
import { useRouter } from 'next/router';

const Requests = ({ user }) => {
  const userId = user.id;
  const [authState] = useContext(AuthContext);
  const { githubId, email } = authState;
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const loggedId = accountData?.id;
  const isOwner = loggedId == user.id;
  const [bounties, setBounties] = useState();
  const router = useRouter();

  useEffect(() => {
    const getOffChainData = async () => {
      if (isOwner) {
        //get watched bounties.
        try {
          const userOffChainData = await appState.openQPrismaClient.getUser({
            id: userId,
            github: githubId,
            email: email,
          });
          const watchedBounties = userOffChainData.watchedBounties.nodes.filter((bounty) => {
            return bounty.request;
          });
          setBounties(watchedBounties);
        } catch (error) {
          router.push('/login');
          appState.logger.error(error, accountData.id, '[userId.js]1');
        }
      } else {
        router.push('/login');
      }
    };
    getOffChainData();
  }, [loggedId, user.id]);
  return <Centered>{bounties ? <RequestPage bounties={bounties} /> : null}</Centered>;
};
export default Requests;

export const getServerSideProps = async (context) => {
  const logger = new Logger();
  const openQPrismaClient = new WrappedOpenQPrismaClient();

  const emailAuth = true;
  let userId = context.params.userId;
  let renderError = '';

  let user = {
    bountiesClosed: [],
    bountiesCreated: [],
    deposits: [],
    fundedTokenBalances: [],
    id: userId,
    payoutTokenBalances: [],
    payouts: [],
    renderError,
    avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4',
  };

  let userOffChainData = {};

  try {
    // 1. We fetch the API user using the userId we get from the URL
    if (emailAuth) {
      userOffChainData = await openQPrismaClient.instance.getPublicUserById(userId);
    } else {
      userOffChainData = await openQPrismaClient.instance.getUser(userId);
    }
    if (!userOffChainData) {
      // This is where we should throw a 404
      return { props: { renderError: `User with id ${userId} not found.` } };
    }
  } catch (error) {
    logger.error(error, null, '[userId.js]2');
  }

  user = {
    ...user,
    ...userOffChainData,
  };

  return {
    props: { user, renderError },
  };
};
