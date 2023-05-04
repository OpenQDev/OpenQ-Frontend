import React, { useContext, useEffect, useState } from 'react';
import RequestIndividual from '../../components/Requests/RequestIndividual';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import StoreContext from '../../store/Store/StoreContext';
import AuthContext from '../../store/AuthStore/AuthContext';
const Request = ({ request }) => {
  const item = {
    bounty: request.bounty,
    request: request,
  };
  const githubId = request.requestingUser.github;
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const [authState] = useContext(AuthContext);
  const [updatedItem, setItem] = useState(null);

  useEffect(() => {
    const getGithubUser = async () => {
      try {
        const githubUser = await appState.githubRepository.fetchUserById(githubId);
        setItem({ ...item, request: { ...item.request, requestingUser: { ...item.requestingUser, githubUser } } });
      } catch (err) {
        appState.logger.error(err, 'RequestIndividual2', accountData.id);
      }
    };
    getGithubUser();
  }, [githubId]);

  return (
    <>
      {!authState?.isAuthenticated && (
        <div className='max-w-[950px] mx-auto my-4 bg-info border-info-strong border-2 p-3 rounded-sm'>
          Please login to accept or decline this request.
        </div>
      )}
      <div className='max-w-[1280px] mx-auto px-40'>{updatedItem && <RequestIndividual item={updatedItem} />}</div>
    </>
  );
};
export default Request;

export const getServerSideProps = async (context) => {
  const { requestId } = context.params;
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const request = await openQPrismaClient.instance.getRequest(requestId);
  return {
    props: {
      request,
    },
  };
};
