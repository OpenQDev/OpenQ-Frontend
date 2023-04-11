import React, { useContext, useState } from 'react';
import RequestIndividual from '../RequestIndividual';
import { getPlural } from '../../../services/utils/lib';
import StoreContext from '../../../store/Store/StoreContext';
import AuthContext from '../../../store/AuthStore/AuthContext';
import PaginatedList from '../../Utils/PaginatedList';
import { fetchRequestsWithServiceArg } from '../../../services/utils/lib';
import SearchBar from '../../Search/SearchBar';
import { useRouter } from 'next/router';
import useWeb3 from '../../../hooks/useWeb3';

const RequestPage = ({ states }) => {
  const router = useRouter();
  const [authState] = useContext(AuthContext);
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { gnosisSafe } = useWeb3();
  const [searchText, setSearchText] = useState('');

  const loggedId = accountData?.id;
  const userId = router.query.userId;

  const isOwner = loggedId == userId;
  const { githubId, email } = authState;
  const getItems = async (oldCursor, batch, ordering = 'asc', fetchFilters = {}) => {
    try {
      return await fetchRequestsWithServiceArg(appState, identity, oldCursor, batch, ordering, fetchFilters);
    } catch (e) {
      appState.logger.error(e);
      return { nodes: [], cursor: null, complete: true };
    }
  };
  const identity = { userId, githubId, email };
  const filterFunction = (item, filters) => {
    if (!filters?.searchText) return true;
    else return item.request.requestingUser?.githubUser.login.toLowerCase().includes(filters.searchText.toLowerCase());
  };
  const paginationObj = {
    items: [],
    ordering: { direction: 'asc', field: 'name' },
    fetchFilters: { states },
    filters: { searchText: '' },
    filterFunction,
    cursor: null,
    complete: false,
    batch: 20,
    getItems,
  };
  const paginationState = useState(paginationObj);
  const [paginationStateObj, setPaginationStateObj] = paginationState;
  const requestsLength = paginationState[0]?.items.length;
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPaginationStateObj({
      ...paginationStateObj,
      filters: { ...paginationStateObj.filters, searchText: e.target.value },
    });
  };
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
          If the submission requires changes, please "Decline" the form submission and write a message to the builder in
          the popup. Once the submission is completed correctly, please click "Accept". If you accept the request, the
          amount deposited in the contract will be unlocked for the builder.
        </div>
        {gnosisSafe && (
          <div className='bg-info border-info-strong border-2 p-3 rounded-sm my-4'>
            Hey! Looks like you are using Gnosis Safe via WalletConnect. Because Gnosis Safes often require multiple
            signatures, this modal will will be stuck in a pending state. Once you're multisig has approved the
            transaction, please reload the app, and you'll see the results of your transaction.
          </div>
        )}
        <SearchBar placeholder='github-user' styles='w-full' value={searchText} onKeyUp={handleSearch} />
        <ul className='flex flex-col gap-4'>
          {isOwner && <PaginatedList paginationState={paginationState} PaginationCard={RequestIndividual} />}
        </ul>
      </div>
    </>
  );
};
export default RequestPage;
