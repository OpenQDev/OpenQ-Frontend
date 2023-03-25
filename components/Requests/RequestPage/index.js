import React, { useContext, useState } from 'react';
import RequestIndividual from '../RequestIndividual/index.js';
import { getPlural } from '../../../services/utils/lib';
import StoreContext from '../../../store/Store/StoreContext';
import AuthContext from '../../../store/AuthStore/AuthContext';
import PaginatedList from '../../Utils/PaginatedList/index.js';
import { fetchRequestsWithServiceArg } from '../../../services/utils/lib';

// Custom
import { useRouter } from 'next/router';
import useWeb3 from '../../../hooks/useWeb3.js';

const RequestPage = () => {
  const router = useRouter();
  const [authState] = useContext(AuthContext);
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { gnosisSafe } = useWeb3();

  const loggedId = accountData?.id;
  const userId = router.query.userId;

  const isOwner = loggedId == userId;
  const { githubId, email } = authState;
  const getItems = async (oldCursor, batch, ordering = 'asc', filters = {}) => {
    try {
      return await fetchRequestsWithServiceArg(appState, identity, oldCursor, batch, ordering, filters);
    } catch (e) {
      appState.logger.error(e);
      return { nodes: [], cursor: null, complete: true };
    }
  };
  const identity = { userId, githubId, email };
  const filterFunction = () => {
    return true;
  };
  const paginationObj = {
    items: [],
    ordering: { direction: 'asc', field: 'name' },
    fetchFilters: {},
    filters: {},
    filterFunction,
    cursor: null,
    complete: false,
    batch: 10,
    getItems,
  };
  const paginationState = useState(paginationObj);
  const requestsLength = paginationState[0]?.items.length;

  return (
    <>
      <div className='my-6'>
        <h2 className='text-2xl font-semibold pb-4 border-b border-web-gray my-4'>Manage your bounties</h2>
        <div className='border-web-gray border flex justify-center content-center h-24 rounded-sm items-center'>
          You have received {requestsLength} request{getPlural(requestsLength)}.
        </div>
      </div>
      <div className='my-6'>
        <h2 className='text-2xl font-semibold pb-4  my-4'>Requests</h2>
        <div className='bg-info border-info-strong border-2 p-3 rounded-sm my-4'>
          If you accept the request, the amount deposited in the contract will be unlocked for the builder. If you are
          not satisfied with the work, please communicate with the builder, and accept the request once you are
          satisfied with their submission.
        </div>

        {gnosisSafe && (
          <div className='bg-info border-info-strong border-2 p-3 rounded-sm my-4'>
            Hey! Looks like you are using gnosis safe via wallet connect. Because gnosis safes often require multiple
            signatures, this modal will will be stuck in a pending state. Once you're multi-sig has approved the
            transaction, please reload the app, and you'll see the results of your transaction.
          </div>
        )}
        <ul className='flex flex-col gap-4'>
          {isOwner && <PaginatedList paginationState={paginationState} PaginationCard={RequestIndividual} />}
        </ul>
      </div>
    </>
  );
};
export default RequestPage;
