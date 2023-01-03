// Third party
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';

//Custom
import BountyCardLean from '../BountyCard/BountyCardLean';
import Dropdown from '../Utils/Dropdown';
import SearchBar from '../Search/SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';
import Carousel from '../Utils/Carousel';
import CarouselBounty from '../Bounty/CarouselBounty';
import SmallToggle from '../Utils/SmallToggle';
import { useRouter } from 'next/router';
import filterBounties from './searchHelpers/filterBounties';
import StoreContext from '../../store/Store/StoreContext';

const BountyList = ({
  bounties,
  watchedBounties,
  loading,
  complete,
  getMoreData,
  getNewData,
  addCarousel,
  contractToggle,
  types,
}) => {
  //Pre hook functions
  const getReadyText = (isContest) => {
    if (isContest) {
      return 'Ready to Hack';
    } else return 'Ready for Work';
  };
  const isOnlyContest = (types) => {
    const includesReady = types.includes('2') || types.includes('3');
    const inlcudesNonReady = types.includes('0') && types.includes('0');
    return includesReady && !inlcudesNonReady;
  };
  const READY_TEXT = getReadyText(isOnlyContest(types));

  // Hooks
  const router = useRouter();
  const [appState] = useContext(StoreContext);
  const [searchText, updateSearchText] = useState(
    `order:newest ${router.query.type ? `type:"${router.query.type}"` : ''}`
  );
  const [currentSearchedLabels, setCurrentSearchedLabels] = useState([]);
  const [tagArr, updateTagArr] = useState([]);
  const [searchedBounties, updateSearchedBounties] = useState([]);
  const [isProcessed, updateIsProcessed] = useState(false);
  const [isReady, setIsReady] = useState(READY_TEXT);
  const [labels, setLabels] = useState([]);
  const [currentContractTypes, setCurrentContractTypes] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(['newest']);
  const contractTypeRegex = /type:"[^"]+"/gi;
  const orderRegex = /order:(\w+)/gi;
  let observer = useRef();
  // Utilities

  const fetchPage = () => {
    const sortOrder = searchText.match(orderRegex)?.[0]?.slice(6) || '';

    switch (sortOrder) {
      case 'newest':
        {
          getMoreData('desc');
        }
        break;
      case 'oldest':
        {
          getMoreData('asc');
        }
        break;
      case 'highest':
        {
          getMoreData('desc', 'tvl');
        }
        break;
      case 'lowest':
        {
          getMoreData('asc', 'tvl');
        }
        break;
      case 'popular':
        {
          getMoreData('desc', 'views');
        }
        break;
    }
  };

  const filterWithOptions = (bounties, options) => {
    return filterBounties(
      bounties,
      options,
      tagArr,
      searchText,
      isReady,
      contractTypeRegex,
      setCurrentSearchedLabels,
      setCurrentContractTypes,
      orderRegex,
      fetchPage,
      complete,
      appState,
      router
    );
  };

  useEffect(() => {
    if (bounties) {
      updateIsProcessed(false);
      updateSearchedBounties(orderBounties(filterWithOptions(bounties), true));
      updateIsProcessed(true);

      const labels =
        bounties
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
    } else {
      updateIsProcessed(true);
    }
  }, [bounties]);
  // NOTE tag search doesn't turn off regular search, it just manages it a little differently.

  // Orders bounties
  const orderBounties = (bounties = [], firstLoad, changed, newOrder) => {
    if (!changed) {
      return bounties;
    }
    const toggleTo = newOrder || searchText.match(orderRegex)?.[0]?.slice(6) || '';
    setCurrentOrder([toggleTo]);
    switch (toggleTo) {
      case 'newest':
        {
          if (complete || firstLoad) {
            return bounties.sort((a, b) => {
              return parseInt(b.createdAt) - parseInt(a.createdAt);
            });
          } else {
            getNewData('desc');
          }
        }
        break;
      case 'oldest':
        {
          if (complete || firstLoad) {
            return bounties.sort((a, b) => {
              return parseInt(a.createdAt) - parseInt(b.createdAt);
            });
          } else {
            getNewData('asc');
          }
        }
        break;
      case 'highest':
        {
          getNewData('desc', 'tvl');
        }
        break;
      case 'lowest':
        {
          getNewData('asc', 'tvl');
        }
        break;
      case 'popular':
        {
          getNewData('desc', 'views');
        }
        break;
    }
    return bounties;
  };

  // User Methods
  const handleSortBounties = (toggleTo) => {
    let newSearch = `${searchText.replace(orderRegex, `order:${toggleTo}`)}`.replace(/\s+/g, ' ');
    if (!orderRegex.test(newSearch)) {
      newSearch = `${searchText} ${`order:${toggleTo}`}`;
    }
    updateSearchText(newSearch);
    updateSearchedBounties(orderBounties(filterWithOptions(searchedBounties, {}), false, true, toggleTo));
  };

  const handleSearchInput = (e) => {
    updateSearchText(e.target.value);
    updateSearchedBounties(orderBounties(filterWithOptions(bounties, { searchText: e.target.value })));
  };
  const addLabel = (label) => {
    if (!searchText.includes(`${searchText} label:"${label}"`)) {
      updateSearchText(`${searchText.trimEnd()} label:"${label}"`);
      updateSearchedBounties(
        orderBounties(filterWithOptions(bounties, { searchText: `${searchText} label:"${label}"` }))
      );
    } else {
      updateSearchText(`${searchText.replace(`label:"${label}"`, '').trimEnd()} `);
      updateSearchedBounties(
        orderBounties(filterWithOptions(bounties, { searchText: `${searchText.replace(`label:"${label}"`, '')}` }))
      );
    }
  };
  const handleRemoveLabel = (label) => {
    updateSearchText(`${searchText.replace(`label:"${label}"`, '').trimEnd()} `);
    updateSearchedBounties(
      orderBounties(filterWithOptions(bounties, { searchText: `${searchText.replace(`label:"${label}"`, '')}` }))
    );
  };

  const setContractType = (type) => {
    let newSearch = `${searchText.replace(contractTypeRegex, `type:"${type}"`)}`.replace(/\s+/g, ' ');
    if (!contractTypeRegex.test(newSearch)) {
      newSearch = `${searchText} ${`type:"${type}"`}`;
    }
    updateSearchText(newSearch);
    updateSearchedBounties(
      orderBounties(
        filterWithOptions(bounties, {
          searchText: `${searchText.replace(contractTypeRegex, '')} type:"${type}"`,
        })
      )
    );
  };

  const handleRemoveTypeCheck = () => {
    let newSearch = `${searchText.replace(contractTypeRegex, '')}`.replace(/\s+/g, ' ');
    updateSearchText(newSearch);
    updateSearchedBounties(
      orderBounties(
        filterWithOptions(bounties, {
          searchText: `${searchText.replace(contractTypeRegex, '')} `,
        })
      )
    );
  };

  const showUnready = (toggleVal) => {
    setIsReady(toggleVal);
    updateSearchedBounties(orderBounties(filterWithOptions(bounties, { isReady: toggleVal })));
  };

  /* const filterByL2e = ()=>{
		setL2eOnly(!l2eOnly);		
		updateSearchedBounties(orderBounties(filter(bounties, { l2eOnly: !l2eOnly })));
	}; */

  const removeTag = (e) => {
    const newTagArr = tagArr.filter((tag) => tag !== e.target.value);
    updateTagArr(newTagArr);
    updateSearchedBounties(orderBounties(filterWithOptions(bounties, { tagArr: newTagArr })));
  };

  const lastElem = useCallback((node) => {
    if (observer.current) {
      observer.current.disconnect();
    }
    if (node) {
      let options = {
        rootMargin: '100px',
        threshold: 0.1,
      };
      const callback = (entries) => {
        if (entries[0].isIntersecting && isProcessed && !complete && !loading) {
          fetchPage();
        }
      };
      observer.current = new IntersectionObserver(callback, options);
      observer.current.observe(node);
    }
  });
  // Render
  return (
    <div className='lg:col-start-2 justify-between justify-self-center space-y-4 w-full pb-8 max-w-[960px] mx-auto'>
      <div className='flex flex-wrap gap-4 w-full items-center'>
        <SearchBar
          onKeyUp={handleSearchInput}
          placeholder={'Search Issue...'}
          searchText={searchText}
          label={'search text'}
          styles={'rounded-sm w-full'}
        />

        <MintBountyButton styles={'w-full'} types={types} />
      </div>
      <div className='w-full rounded-sm'>
        <div className='flex flex-wrap gap-4 p-2 sm:p-4 border-web-gray border rounded-sm bg-subtle'>
          <SmallToggle
            names={[READY_TEXT, 'All issues']}
            toggleVal={isReady === READY_TEXT ? READY_TEXT : 'All issues'}
            toggleFunc={showUnready}
          />

          <Dropdown
            dropdownWidth='w-36'
            toggleFunc={handleSortBounties}
            toggleVal={currentOrder}
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
            toggleVal={currentSearchedLabels}
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
              toggleVal={currentContractTypes}
              styles='whitespace-nowrap'
              width='w-36'
              title='Contract Type'
              names={['Fixed Price', 'Split Price', 'Contest']}
              borderShape={'rounded-r-lg'}
            />
          )}
        </div>
      </div>
      {tagArr.length > 0 && (
        <ul className='flex flex-wrap'>
          {tagArr.map((tag, index) => (
            <li key={index} className='border-web-gray border  inline mr-2 mb-2 px-2 py-1.5 rounded-lg'>
              <span className='px-2'>{tag}</span>
              <button
                aria-label={`remove ${tag} filter`}
                onClick={removeTag}
                value={tag}
                className='bg-inactive-gray hover:bg-active-gray hover:cursor-pointer inline-flex justify-center content-center h-6 w-6 leading-tight rounded-full'
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {addCarousel && watchedBounties.length ? (
        <Carousel watchedBounties={watchedBounties} styles={'col-start-2'}>
          {watchedBounties.map((watchedBounty, index) => {
            return <CarouselBounty key={index} bounty={watchedBounty} />;
          })}
        </Carousel>
      ) : null}
      {isProcessed && !loading && searchedBounties.length > 0 && (
        <div className='md:border border-web-gray rounded-sm'>
          {searchedBounties.map((bounty, index) => {
            return (
              <div key={bounty.id} ref={index === searchedBounties.length - 1 ? lastElem : null}>
                <BountyCardLean index={index} length={searchedBounties.length} bounty={bounty} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default BountyList;
