// Third party
import React, { useState, useContext } from 'react';

//Custom
import StoreContext from '../../../store/Store/StoreContext';
import PaginatedList from '../../../components/Utils/PaginatedList';
import { fetchBountiesWithServiceArg } from '../../../services/utils/lib';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import ClaimsPerBounty from './ClaimsPerBounty';

const ClaimsTracking = ({ paginationObj }) => {
  const [appState] = useContext(StoreContext);
  const getItems = async (oldCursor, batch, ordering, filters = {}) => {
    return await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);
  };

  const filterFunction = (item, filters) => {
    console.log('item', item, filters);
    const isBounty = filters.searchText?.issueText
      ? item.title?.toLowerCase().includes(filters.searchText.issueText.toLowerCase()) ||
        item.alternativeName?.toLowerCase().includes(filters.searchText.issueText.toLowerCase())
      : true;
    const hasGithubId = filters.searchText?.githubId
      ? item.tierWinners?.some((tierWinner) => tierWinner == filters.searchText?.githubId)
      : true;
    const show = isBounty && hasGithubId;
    return show;
  };

  const paginationObjWithFunctions = { ...paginationObj, filterFunction: filterFunction, getItems };

  // Hooks
  const paginationState = useState(paginationObjWithFunctions);
  const [paginationStateObj, setPaginationStateObj] = paginationState;
  const { searchText } = paginationStateObj.filters;
  const [issueText, setIssueText] = useState(searchText);
  const [filteredLength, setFilteredLength] = useState(0);
  const [githubId, setGithubId] = useState('');
  const [githubLogin, setGithubLogin] = useState('');

  // Utilities

  const setSearch = (searchType, searchedText) => {
    setPaginationStateObj({
      ...paginationStateObj,
      filters: {
        ...paginationStateObj.filters,
        searchText: { ...searchText, [searchType]: searchedText },
      },
    });
  };

  const handleSearchInput = (e) => {
    if (e.target.id === 'issueText') setIssueText(e.target.value);
    if (e.target.id === 'githubId') setGithubId(e.target.value);
    if (e.target.id === 'githubLogin') setGithubLogin(e.target.value);
  };

  const handleKeyPress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === 'Enter') {
      setSearch(e.target.id, e.target.value);
      if (e.target.id === 'githubId') setGithubLogin('');
    }
  };

  const handleKeyPressLogin = (e) => {
    //it triggers by pressing the enter key
    if (e.key === 'Enter') {
      setGithubId('');
      const getGithubUser = async () => {
        const githubUser = await appState.githubRepository.fetchUserByLogin(e.target.value);
        if (githubUser) {
          setSearch('githubId', githubUser.id);
          setGithubId('');
        }
      };
      try {
        if (e.target.value) {
          getGithubUser();
        } else {
          setSearch('githubId', '');
        }
      } catch (err) {
        appState.logger.error(err, 'ClaimsTracking.js1');
      }
    }
  };

  // Render
  return (
    <div className='lg:col-start-2 justify-between justify-self-center space-y-4 w-full pb-8 max-w-[960px] mx-auto'>
      <div className='flex flex-wrap gap-4 w-full items-center'>
        <input
          className='input-field'
          id='issueText'
          placeholder='Search Issue...'
          value={issueText}
          onChange={handleSearchInput}
          onKeyDown={handleKeyPress}
        />
      </div>
      {paginationState[0].complete && filteredLength == 0 && (
        <div className='bg-info border-info-strong border-2 p-3 rounded-sm mb-4 text-center'>No Bounties Found</div>
      )}
      {!paginationState[0].complete && filteredLength == 0 && (
        <div className='flex justify-center items-center bg-info border-info-strong border-2 p-3 rounded-sm mb-4'>
          Searching... <LoadingIcon />
        </div>
      )}
      <div className='flex flex-col mb-4 lg:min-w-[1000px] overflow-x-auto border border-web-gray rounded-sm p-4'>
        <div className='mb-2'>Filter by:</div>
        <div className='mb-2 text-sm text-mute italic'>
          Note that all search input must be an exact match for the search fields below.
        </div>
        <div className='items-center gap-4 grid grid-cols-[3fr_1fr_0.5fr_0.5fr_0.75fr_0.5fr] border-b border-web-gray pb-2 mb-2 font-bold'>
          <div className=''>TierWinner</div>
          <div className='flex justify-center'>Planned</div>
          <div className='flex justify-center'>W8/W9?</div>
          <div className='flex justify-center'>KYC'd?</div>
          <div className='flex justify-center'>Wallet</div>
          <div className='flex justify-center'>Claimed</div>
        </div>
        <div className='items-center gap-4 grid grid-cols-[3fr_1fr_0.5fr_0.5fr_0.75fr_0.5fr] pb-2 mb-2'>
          <div className='flex items-center gap-4'>
            <input
              className='input-field'
              id='githubId'
              placeholder='Github ID'
              value={githubId}
              onChange={handleSearchInput}
              onKeyDown={handleKeyPress}
            />
            {' OR '}
            <input
              className='input-field'
              id='githubLogin'
              placeholder='Github Login'
              value={githubLogin}
              onChange={handleSearchInput}
              onKeyDown={handleKeyPressLogin}
            />
          </div>

          <div className='flex justify-center'>Planned</div>
          <div className='flex justify-center'>W8/W9?</div>
          <div className='flex justify-center'>KYC'd?</div>
          <div className='flex justify-center'>Wallet</div>
          <div className='flex justify-center'>Claimed</div>
        </div>
      </div>
      <PaginatedList
        paginationState={paginationState}
        PaginationCard={ClaimsPerBounty}
        setFilteredLength={setFilteredLength}
        filteredLength={filteredLength}
      />
    </div>
  );
};
export default ClaimsTracking;
