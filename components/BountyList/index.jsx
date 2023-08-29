// Third party
import React, { useState, useContext } from 'react';

//Custom
import BountyCardLean from '../BountyCard/BountyCardLean';
import Dropdown from '../Utils/Dropdown';
import SearchBar from '../SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';
import Carousel from '../Utils/Carousel';
import CarouselBounty from '../Bounty/CarouselBounty';
import SmallToggle from '../Utils/SmallToggle';
import StoreContext from '../../store/Store/StoreContext';
import PaginatedList from '../Utils/PaginatedList';
import { fetchBountiesWithServiceArg, getReadyText, isOnlyContest } from '../../services/utils/lib';
import filterBounties from './searchHelpers/filterBounties';
import LoadingIcon from '../Loading/ButtonLoadingIcon';

const BountyList = ({ watchedBounties, addCarousel, contractToggle, types, paginationObj }) => {
  const READY_TEXT = getReadyText(isOnlyContest(types));
  const [sortOrder, setSortOrder] = useState('newest');
  const filterBounties = () => {
    return true;
  };
  const getItems = async (oldCursor, batch, ordering, filters = {}) => {
    return await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);
  };
  const paginationObjWithFunctions = { ...paginationObj, filterFunction: filterBounties, getItems };

  // Hooks
  const [appState] = useContext(StoreContext);
  const paginationState = useState(paginationObjWithFunctions);
  const [paginationStateObj, setPaginationStateObj] = paginationState;
  const { searchText } = paginationStateObj.filters;
  const [renderedSearch, setRenderedSearch] = useState(searchText);
  const [filteredLength, setFilteredLength] = useState(0);
  let showDropdowns = true;
  // Utilities

  const setSearch = (searchText) => {
    setRenderedSearch(searchText);
    setPaginationStateObj({
      ...paginationStateObj,
      filters: {
        ...paginationStateObj.filters,
        searchText: searchText,
      },
    });
  };

  const contractTypeRegex = /type:"[^"]+"/gi;
  const handleSortBounties = (toggleTo) => {
    let newOrdering = {};
    switch (toggleTo) {
      case 'newest':
        newOrdering = { field: 'createdAt', sortOrder: 'desc' };
        break;
      case 'oldest':
        newOrdering = { field: 'createdAt', sortOrder: 'asc' };
        break;
      case 'highest tvl':
        newOrdering = { field: 'tvl', sortOrder: 'desc' };
        break;
      case 'lowest tvl':
        newOrdering = { field: 'tvl', sortOrder: 'asc' };
        break;
      case 'highest budget':
        newOrdering = { field: 'budgetValue', sortOrder: 'desc' };
        break;
      case 'lowest budget':
        newOrdering = { field: 'budgetValue', sortOrder: 'asc' };
        break;
    }

    setPaginationStateObj({
      ...paginationStateObj,
      items: [],
      filters: {
        ...paginationStateObj.filters,
      },
      ordering: newOrdering,
      cursor: null,
      complete: false,
    });
    setSortOrder(toggleTo);
  };
  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  };
  const enter = () => {
    setPaginationStateObj({
      ...paginationStateObj,
      items: [],
      fetchFilters: {
        ...paginationStateObj.fetchFilters,
        title: searchText,
      },
      cursor: null,
      complete: false,
    });
  };

  const setContractType = (type) => {
    let newSearch = `${searchText.replace(contractTypeRegex, `type:"${type}"`)}`.replace(/\s+/g, ' ');
    if (!contractTypeRegex.test(newSearch)) {
      newSearch = `${searchText.trimEnd()} ${`type:"${type}"`}`;
    }
    setSearch(newSearch);
  };

  const handleRemoveTypeCheck = () => {
    let newSearch = `${searchText.replace(contractTypeRegex, '')}`.replace(/\s+/g, ' ');
    setSearch(newSearch);
  };

  const showUnready = (toggleVal) => {
    paginationState[0].filters.isReady = toggleVal;
    setPaginationStateObj({
      ...paginationStateObj,
      filters: {
        ...paginationStateObj.filters,
        isReady: toggleVal,
      },
    });
  };

  const contractType = searchText.match(contractTypeRegex)?.[0]?.slice(6) || '';

  const getKey = () => {
    return null;
  };
  // Render
  return (
    <div className='lg:col-start-2 justify-between justify-self-center space-y-4 w-full pb-8 max-w-[960px] mx-auto'>
      <div className='flex flex-wrap gap-4 w-full items-center'>
        <SearchBar
          enter={enter}
          onKeyUp={handleSearchInput}
          placeholder={'Search Issue...'}
          searchText={renderedSearch}
          label={'search text'}
          styles={'rounded-sm w-full'}
        />

        <MintBountyButton styles={'w-full'} types={types} />
      </div>
      <div className='w-full rounded-sm'>
        <div className='flex flex-wrap gap-4 p-2 sm:p-4 border-web-gray border rounded-sm bg-subtle'>
          {false && (
            <SmallToggle
              names={[READY_TEXT, 'All issues']}
              toggleVal={paginationStateObj.filters.isReady === READY_TEXT ? READY_TEXT : 'All issues'}
              toggleFunc={showUnready}
            />
          )}

          {showDropdowns ? (
            <>
              {' '}
              <Dropdown
                dropdownWidth='w-36'
                toggleFunc={handleSortBounties}
                toggleVal={sortOrder || 'newest'}
                styles='whitespace-nowrap'
                width='w-32'
                title={'Sort Order'}
                names={['newest', 'oldest', 'highest budget', 'lowest budget', 'highest tvl', 'lowest tvl']}
                borderShape={'rounded-r-lg'}
              />
              {contractToggle && (
                <Dropdown
                  dropdownWidth='w-36'
                  toggleFunc={setContractType}
                  removeFunc={handleRemoveTypeCheck}
                  toggleVal={contractType || ''}
                  styles='whitespace-nowrap'
                  width='w-36'
                  title='Contract Type'
                  names={['Fixed Price', 'Split Price', 'Hackathon']}
                  borderShape={'rounded-r-lg'}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      {addCarousel && watchedBounties.length ? (
        <Carousel watchedBounties={watchedBounties} styles={'col-start-2'}>
          {watchedBounties.map((watchedBounty, index) => {
            return <CarouselBounty key={index} bounty={watchedBounty} />;
          })}
        </Carousel>
      ) : null}
      {paginationState[0].complete && filteredLength == 0 && (
        <div className='bg-info border-info-strong border-2 p-3 rounded-sm mb-4 text-center'>No Bounties Found</div>
      )}
      {!paginationState[0].complete && filteredLength == 0 && (
        <div className='flex justify-center items-center bg-info border-info-strong border-2 p-3 rounded-sm mb-4'>
          Searching... <LoadingIcon />
        </div>
      )}
      <PaginatedList
        getKey={getKey}
        paginationState={paginationState}
        PaginationCard={BountyCardLean}
        setFilteredLength={setFilteredLength}
        filteredLength={filteredLength}
      />
    </div>
  );
};
export default BountyList;
