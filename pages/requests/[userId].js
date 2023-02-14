import React from 'react';

// Custom
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import Logger from '../../services/logger/Logger';
import Centered from '../../components/Layout/Centered';
import RequestPage from '../../components/Requests/RequestPage/index.js';
import AuthorizedOnly from '../../components/Authentication/HigherOrderComponents/OwnerOnly';
import { useRouter } from 'next/router';

const Requests = () => {
  const router = useRouter();
  const { userId } = router.query;
  return (
    <Centered>
      <AuthorizedOnly slug='' expectedId={userId}>
        <RequestPage />
      </AuthorizedOnly>
    </Centered>
  );
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
