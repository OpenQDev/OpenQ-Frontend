import React, { useEffect, useContext, useState } from 'react';
import RequestIndividual from '../RequestIndividual/index.js';
import { getPlural } from '../../../services/utils/lib';
import StoreContext from '../../../store/Store/StoreContext';
import AuthContext from '../../../store/AuthStore/AuthContext';

// Custom
import { useRouter } from 'next/router';

const RequestPage = ({ user }) => {
  const userId = user.id;
  const [authState] = useContext(AuthContext);
  const { githubId, email } = authState;
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const loggedId = accountData?.id;
  const isOwner = loggedId == user.id;
  const [bounties, setBounties] = useState([]);
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
  return (
    <>
      <div className='my-6'>
        <h2 className='text-2xl font-semibold pb-4 border-b border-web-gray my-4'>Manage your bounties</h2>
        <div className='border-web-gray border flex justify-center content-center h-24 rounded-sm items-center'>
          You have recieved {bounties.length} new request{getPlural(bounties.length)}.
        </div>
      </div>
      {bounties.length ? (
        <div className='my-6'>
          <h2 className='text-2xl font-semibold pb-4  my-4'>Requests</h2>
          <div className='bg-info border-info-strong border-2 p-3 rounded-sm my-4'>
            If you accept the request, the amount deposited in the contract will be unlocked for the builder. If you are
            not satisfied with the work, please communicate with the builder, and accept the request once you are
            satisfied with their submission.
          </div>
          <ul className='flex flex-col gap-4'>
            {bounties.map((bounty, index) => {
              return <RequestIndividual key={index} bounty={bounty} />;
            })}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default RequestPage;
