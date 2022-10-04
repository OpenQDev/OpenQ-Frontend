// Third party
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';

//Custom
import BountyCardLean from '../BountyCard/BountyCardLean';
import Dropdown from '../Utils/Dropdown';
import SearchBar from '../Search/SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';
import Carousel from '../Utils/Carousel';
import CarouselBounty from '../Bounty/CarouselBounty';
import useWeb3 from '../../hooks/useWeb3';
import searchFoundInText from './searchHelpers/searchFoundInText';
import searchFoundInLabels from './searchHelpers/searchFoundInLabels';
import searchTagInBounty from './searchHelpers/searchTagInBounty';
import SmallToggle from '../Utils/SmallToggle';
import { useRouter } from 'next/router';
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
  wizard,
  types,
  category,
}) => {
  // Hooks
  const { account } = useWeb3();
  const [appState] = useContext(StoreContext);
  const router = useRouter();
  const [searchText, updateSearchText] = useState(
    `order:newest ${router.query.type && category !== 'non-profit' ? `type:"${router.query.type}"` : ''}`
  );
  const [tagArr, updateTagArr] = useState([]);
  const [searchedBounties, updateSearchedBounties] = useState([]);
  const [isProcessed, updateIsProcessed] = useState(false);
  const [isReady, setIsReady] = useState('Ready for work');
  const [labels, setLabels] = useState([]);
  const searchRegex = /label:"[^"]+"/gi;
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

  useEffect(() => {
    if (bounties) {
      updateIsProcessed(false);
      updateSearchedBounties(orderBounties(filter(bounties), true));
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

  useEffect(() => {
    if (category === 'non-profit') {
      addLabel('non-profit');
    }
  }, [category]);

  const filter = (bounties, options = {}) => {
    const localTagArr = options.tagArr || tagArr;
    const localSearchText = options.searchText === undefined ? searchText : options.searchText;
    const localIsReady = options.isReady === undefined ? isReady : options.isReady;

    const searchedLabelsWrapped = localSearchText.match(searchRegex) || [];
    const contractsTypesWrapped = localSearchText.match(contractTypeRegex) || [];
    const searchedLabels = searchedLabelsWrapped.map((elem) => elem.slice(7, -1));
    const contractType = contractsTypesWrapped.map((elem) => elem.slice(6, -1))[0];

    let types = ['0', '1', '2', '3'];

    switch (contractType) {
      case 'Fixed Price':
        types = ['0'];
        break;
      case 'Contest':
        types = ['2', '3'];
        break;
      case 'Split Price':
        types = ['1'];
        break;
    }

    const displayBounties = bounties.filter((bounty) => {
      const hasLabels =
        searchedLabels.some((searchedLabel) =>
          bounty.labels.some((bountyLabel) => bountyLabel.name === searchedLabel)
        ) || searchedLabels.length === 0;

      const isType = types.some((type) => type === bounty.bountyType);
      let containsSearch = true;

      try {
        // Simple search
        let lowerCaseSearch = localSearchText
          .replace(searchRegex, '')
          .toLowerCase()
          .replace(orderRegex, '')
          .replace(contractTypeRegex, '')
          .trim();
        const isFoundInText = searchFoundInText(bounty.title, bounty.body, lowerCaseSearch);
        const isFoundInLabels = searchFoundInLabels(bounty, lowerCaseSearch);
        const emptySearchText = localSearchText.length === 0;
        containsSearch = isFoundInText || isFoundInLabels || emptySearchText;

        // Tags
        const containsTag = searchTagInBounty(bounty, localTagArr);
        // Check based filters
        const isUnclaimed = bounty.status === '0';
        const isFunded = bounty?.deposits?.some((deposit) => {
          return !deposit.refunded;
        });
        const isOpenOnGithub = !bounty.closed;
        const hasBudget = bounty.fundingGoalVolume > 0;
        const isAssigned = bounty.assignees?.length > 0;

        // some auto generated bounties show up as funded but don't display anything, that's because they are funded at really low values.
        // Combine
        return (
          containsSearch &&
          containsTag &&
          (((hasBudget || isFunded) && isUnclaimed && !isAssigned && isOpenOnGithub) ||
            localIsReady === 'All issues') &&
          hasLabels &&
          bounty.url &&
          !bounty.blacklisted &&
          isType
        );
      } catch (err) {
        appState.logger.error(err);
      }
    });

    if (displayBounties.length === 0 && !complete) {
      fetchPage();
      return [];
    } else return displayBounties;
  };

  // Orders bounties
  const orderBounties = (bounties = [], firstLoad, changed, newOrder) => {
    if (!changed) {
      return bounties;
    }
    const toggleTo = newOrder || searchText.match(orderRegex)?.[0]?.slice(6) || '';
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
    updateSearchedBounties(orderBounties(filter(searchedBounties, {}), false, true, toggleTo));
  };

  const handleSearchInput = (e) => {
    updateSearchText(e.target.value);
    updateSearchedBounties(orderBounties(filter(bounties, { searchText: e.target.value })));
  };
  const addLabel = (label) => {
    if (!searchText.includes(label)) {
      updateSearchText(`${searchText} label:"${label}"`);
      updateSearchedBounties(orderBounties(filter(bounties, { searchText: `${searchText} label:"${label}"` })));
    } else {
      updateSearchText(`${searchText.replace(`label:"${label}"`, '').trimEnd()} `);
      updateSearchedBounties(
        orderBounties(filter(bounties, { searchText: `${searchText.replace(`label:"${label}"`, '')}` }))
      );
    }
  };

  const setContractType = (type) => {
    let newSearch = `${searchText.replace(contractTypeRegex, `type:"${type}"`)}`.replace(/\s+/g, ' ');
    if (!contractTypeRegex.test(newSearch)) {
      newSearch = `${searchText} ${`type:"${type}"`}`;
    }
    updateSearchText(newSearch);
    updateSearchedBounties(
      orderBounties(
        filter(bounties, {
          searchText: `${searchText.replace(contractTypeRegex, '')} type:"${type}"`,
        })
      )
    );
  };

  const showUnready = (toggleVal) => {
    setIsReady(toggleVal);
    updateSearchedBounties(orderBounties(filter(bounties, { isReady: toggleVal })));
  };

  /* const filterByL2e = ()=>{
		setL2eOnly(!l2eOnly);		
		updateSearchedBounties(orderBounties(filter(bounties, { l2eOnly: !l2eOnly })));
	}; */

  const removeTag = (e) => {
    const newTagArr = tagArr.filter((tag) => tag !== e.target.value);
    updateTagArr(newTagArr);
    updateSearchedBounties(orderBounties(filter(bounties, { tagArr: newTagArr })));
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

        <MintBountyButton styles={'w-full'} types={types} wizard={wizard} />
      </div>
      <div className='w-full rounded-sm'>
        <div className='flex flex-wrap gap-4 p-2 sm:p-4 border-web-gray border rounded-sm bg-subtle'>
          <SmallToggle
            names={['Ready for work', 'All issues']}
            toggleVal={isReady === 'Ready for work' ? 'Ready for work' : 'All issues'}
            toggleFunc={showUnready}
          />

          <Dropdown
            toggleFunc={handleSortBounties}
            toggleVal={''}
            styles='whitespace-nowrap'
            width='32'
            title={'Sort Order'}
            names={['newest', 'oldest', 'highest', 'lowest']}
            borderShape={'rounded-r-lg'}
          />
          <Dropdown
            toggleFunc={addLabel}
            toggleVal={''}
            styles='whitespace-nowrap'
            width='24'
            title='Labels'
            names={labels}
            borderShape={'rounded-r-lg'}
          />
          {contractToggle && (
            <Dropdown
              toggleFunc={setContractType}
              toggleVal={''}
              styles='whitespace-nowrap'
              width='36'
              title='Contract Type'
              names={['Fixed Price', 'Split Price', 'Contest', 'All']}
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

      {addCarousel && account && watchedBounties.length ? (
        <Carousel watchedBounties={watchedBounties} styles={'col-start-2'}>
          {watchedBounties.map((watchedBounty, index) => (
            <CarouselBounty key={index} bounty={watchedBounty} />
          ))}
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
