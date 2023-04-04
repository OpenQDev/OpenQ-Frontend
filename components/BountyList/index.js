// Third party
import React, { useState, useEffect, useContext } from 'react';

//Custom
import BountyCardLean from '../BountyCard/BountyCardLean';
import Dropdown from '../Utils/Dropdown';
import SearchBar from '../SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';
import Carousel from '../Utils/Carousel';
import CarouselBounty from '../Bounty/CarouselBounty';
import SmallToggle from '../Utils/SmallToggle';
import StoreContext from '../../store/Store/StoreContext';
import PaginatedList from '../../components/Utils/PaginatedList';
import { fetchBountiesWithServiceArg, getReadyText, isOnlyContest } from '../../services/utils/lib';
import filterBounties from './searchHelpers/filterBounties/index.js';

const BountyList = ({ watchedBounties, addCarousel, contractToggle, types, paginationObj }) => {
  const READY_TEXT = getReadyText(isOnlyContest(types));
  const getItems = async (oldCursor, batch, ordering, filters = {}) => {
    return await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);
  };
  const paginationObjWithFunctions = { ...paginationObj, filterFunction: filterBounties, getItems };

  // Hooks
  const [appState] = useContext(StoreContext);
  const [labels, setLabels] = useState([]);
  const paginationState = useState(paginationObjWithFunctions);
  const [paginationStateObj, setPaginationStateObj] = paginationState;
  const { searchText } = paginationStateObj.filters;
  const [renderedSearch, setRenderedSearch] = useState(searchText);
  let showDropdowns;

  // Utilities

  useEffect(() => {
    const labels =
      paginationState[0].items
        ?.reduce((accum, bounty) => {
          const bountyLabels = bounty.labels.filter((label) => {
            const accumFilter = accum.some((accumLabel) => {
              return label.name.toLowerCase() === accumLabel.name.toLowerCase();
            });
            return !accumFilter;
          });
          return [...accum, ...bountyLabels];
        }, [])
        .map((label) => label.name) || [];
    setLabels(labels);
  }, [paginationStateObj.items.length]);

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
  const orderRegex = /order:(\w+)/gi;
  const handleSortBounties = (toggleTo) => {
    let newSearch = `${searchText.replace(orderRegex, `order:${toggleTo}`)}`.replace(/\s+/g, ' ');
    if (!orderRegex.test(newSearch)) {
      newSearch = `${searchText} ${`order:${toggleTo}`}`;
    }

    setPaginationStateObj({
      ...paginationStateObj,
      items: [],
      filters: {
        ...paginationStateObj.filters,
        searchText: newSearch,
      },
      cursor: null,
      complete: false,
    });
  };
  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  };
  const addLabel = (label) => {
    if (!searchText.includes(`label:"${label}"`)) {
      setSearch(`${searchText.trimEnd()} label:"${label}"`);
    } else {
      setSearch(`${searchText.replace(`label:"${label}"`, '').trimEnd()} `);
    }
  };
  const handleRemoveLabel = (label) => {
    setSearch(`${searchText.replace(`label:"${label}"`, '').trimEnd()} `);
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
  const searchedLabelsUnparsed = searchText.match(/label:"[^"]+"/gi) || [];
  const searchedLabels = searchedLabelsUnparsed.map((label) => {
    return label.slice(7, label.length - 1);
  });
  const sortOrder = searchText.match(orderRegex)?.[0]?.slice(6) || '';

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

        <MintBountyButton styles={'w-full'} types={types} />
      </div>
      <div className='w-full rounded-sm'>
        <div className='flex flex-wrap gap-4 p-2 sm:p-4 border-web-gray border rounded-sm bg-subtle'>
          <SmallToggle
            names={[READY_TEXT, 'All issues']}
            toggleVal={paginationStateObj.filters.isReady === READY_TEXT ? READY_TEXT : 'All issues'}
            toggleFunc={showUnready}
          />

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
                names={['newest', 'oldest', 'highest', 'lowest']}
                borderShape={'rounded-r-lg'}
              />
              <Dropdown
                dropdownWidth='w-52'
                toggleFunc={addLabel}
                removeFunc={handleRemoveLabel}
                toggleVal={searchedLabels}
                styles='whitespace-nowrap w-56 md:w-24'
                width='w-24'
                title='Labels'
                names={labels}
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
      <PaginatedList paginationState={paginationState} PaginationCard={BountyCardLean} />
    </div>
  );
};
export default BountyList;
