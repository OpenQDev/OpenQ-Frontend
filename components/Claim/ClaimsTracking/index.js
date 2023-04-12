// Third party
import React, { useState, useContext } from 'react';

//Custom
import SearchBar from '../../Search/SearchBar';
import StoreContext from '../../../store/Store/StoreContext';
import PaginatedList from '../../../components/Utils/PaginatedList';
import { fetchBountiesWithServiceArg } from '../../../services/utils/lib';
import filterBounties from '../../BountyList/searchHelpers/filterBounties/index.js';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import ClaimsPerBounty from './ClaimsPerBounty';

const ClaimsTracking = ({ paginationObj }) => {
  const getItems = async (oldCursor, batch, ordering, filters = {}) => {
    return await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);
  };
  const paginationObjWithFunctions = { ...paginationObj, filterFunction: filterBounties, getItems };

  // Hooks
  const [appState] = useContext(StoreContext);
  const paginationState = useState(paginationObjWithFunctions);
  paginationState[0].filters.isReady = 'All issues';
  const [paginationStateObj, setPaginationStateObj] = paginationState;
  const { searchText } = paginationStateObj.filters;
  const [renderedSearch, setRenderedSearch] = useState(searchText);
  const [filteredLength, setFilteredLength] = useState(0);

  // Utilities

  const setSearch = (searchText) => {
    setRenderedSearch(searchText);
    setPaginationStateObj({
      ...paginationStateObj,
      filters: {
        ...paginationStateObj.filters,
        isReady: 'All issues',
        searchText: searchText,
      },
    });
  };

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  };

  // Render
  return (
    <div className='lg:col-start-2 justify-between justify-self-center space-y-4 w-full pb-8 max-w-[960px] mx-auto'>
      <div className='flex flex-wrap gap-4 w-full items-center'>
        <SearchBar
          onKeyUp={handleSearchInput}
          placeholder={'Search Issue...'}
          searchText={renderedSearch}
          label={'search text'}
          styles={'rounded-sm w-full'}
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
