// Third party
import React, { useState, useContext, useEffect, useMemo } from 'react';

//Custom
import StoreContext from '../../../store/Store/StoreContext';
import { fetchBountiesWithServiceArg } from '../../../services/utils/lib';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import ClaimsPerBounty from './ClaimsPerBounty';
import useWeb3 from '../../../hooks/useWeb3';
import useGetTokenValues from '../../../hooks/useGetTokenValues';

const ClaimsTracking = ({ fetchFilters, TVLBalances, payoutBalances }) => {
  const { account } = useWeb3(true);
  const [appState] = useContext(StoreContext);

  // Hooks
  const [issueText, setIssueText] = useState('');
  const [filters, setFilters] = useState({});
  const [initialItems, setInitialItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [githubId, setGithubId] = useState('');
  const [githubLogin, setGithubLogin] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [countAll, setCountAll] = useState('');
  const [bountyCount, setBountyCount] = useState(0);
  const [nbPayouts, setNbPayouts] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [tierAmount, setTierAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBounties, setLoadingBounties] = useState(false);
  const ordering = { sortOrder: 'desc', field: 'createdAt' };
  const createTVLObj = (TVLBalances) => {
    return TVLBalances.map((item) => {
      return { tokenAddress: item.id?.split('-')[1], volume: item.volume };
    });
  };
  const TVLObj = useMemo(() => createTVLObj(TVLBalances), [TVLBalances]);
  const [TVLValues] = useGetTokenValues(TVLObj);
  const TVL = TVLValues?.total;

  const createPayoutObj = (payoutBalances) => {
    return payoutBalances.map((item) => {
      return { tokenAddress: item.id?.split('-')[1], volume: item.volume };
    });
  };
  const payoutObj = useMemo(() => createPayoutObj(payoutBalances), [payoutBalances]);
  const [payoutValues] = useGetTokenValues(payoutObj);
  const payout = payoutValues?.total;

  useEffect(() => {
    setLoadingBounties(true);
    const fetchPage = async () => {
      let cursor = null;
      let nodes = [];
      let complete = false;
      while (!complete) {
        const {
          nodes: newNodes,
          cursor: newCursor,
          complete: newComplete,
        } = await getItems(cursor, 100, ordering, fetchFilters);
        nodes = [...nodes, ...newNodes];
        cursor = newCursor;
        complete = newComplete;
        console.log('while loop claim progress - nodes, cursor, complete', nodes, cursor, complete);
      }
      setInitialItems(nodes);
      setFilteredItems(nodes);
      setLoadingBounties(false);
    };
    fetchPage();
  }, []);
  console.log('filteredItems', filteredItems);

  useEffect(() => {
    const newFilteredItems = filtering(initialItems, filters);
    setFilteredItems(newFilteredItems);
  }, [filters]);

  useEffect(() => {
    let newTierAmount = 0;
    for (let id in filteredInfo) {
      if (filteredInfo[id].filteredCount) {
        newTierAmount += filteredInfo[id]?.filteredCount;
      }
    }
    setTierAmount(newTierAmount);
  }, [filteredInfo]);

  useEffect(() => {
    let newCountAll = 0;
    let newNbPayouts = 0;
    setLoading(true);
    //let newPrizeObj = {};
    if (initialItems?.length > 0) {
      newNbPayouts = initialItems.reduce((acc, item) => {
        newCountAll += item.payoutSchedule?.length || 0;
        return acc + (item.payouts?.length || 0);
      }, 0);
      setBountyCount(initialItems.length);
      setNbPayouts(newNbPayouts);
      setCountAll(newCountAll);
      setLoading(false);
      // prizeObj = newPrizeObj;
    }
  }, [initialItems]);

  // Utilities

  const getItems = async (oldCursor, batch, ordering, filters = {}) => {
    return await fetchBountiesWithServiceArg(appState, oldCursor, batch, ordering, filters);
  };

  const filtering = (items, filters) => {
    return items.filter((item) => {
      return filterFunction(item, filters);
    });
  };

  const filterFunction = (item, filters) => {
    const isBounty = filters.issueText
      ? item.title?.toLowerCase().includes(filters.issueText.toLowerCase()) ||
        item.alternativeName?.toLowerCase().includes(filters.issueText.toLowerCase())
      : true;
    return isBounty;
  };

  const setSearch = (searchType, searchedText) => {
    const newSearch = { [searchType]: searchedText };
    setFilters({ ...filters, ...newSearch });
  };

  const handleSearchInput = (e) => {
    if (e.target.id === 'issueText') setIssueText(e.target.value);
    if (e.target.id === 'githubId') setGithubId(e.target.value);
    if (e.target.id === 'githubLogin') setGithubLogin(e.target.value);
    if (e.target.id === 'walletAddress') setWalletAddress(e.target.value);
  };

  const handleSelect = (e) => {
    //it triggers by pressing the enter key
    setSearch(e.target.id, e.target.value);
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

  const gridFormat = 'grid grid-cols-[2.5fr_1fr_0.75fr_0.5fr_0.75fr_0.5fr]';

  // Render
  return (
    <>
      <div className='px-4 py-3 gap-6 w-full flex flex-wrap md:flex-nowrap'>
        <div className='max-w-[960px] w-full md:basis-3/4 md:shrink'>
          <h2 className='text-primary w-full mb-2'>Claims Overview</h2>
          {!account && (
            <div className='border-info-strong bg-info border-2 p-2 rounded-sm mb-4'>
              * You need to connect your wallet to see whether a winner has KYC'd or not.
            </div>
          )}
          <div className='flex flex-wrap gap-4 w-full items-center mb-2'>
            <div>Total # of Bounties: {loading ? 'Loading...' : bountyCount}</div>
            <div>Total # of Tiers: {loading ? 'Loading...' : countAll}</div>
            <div>Total # of Selected Tiers: {loading ? 'Loading...' : tierAmount} </div>
            <div>Total # of Unselected Tiers: {loading ? 'Loading...' : countAll - tierAmount} </div>
            <div>Total # of Payouts: {loading ? 'Loading...' : nbPayouts} </div>
          </div>
          <div className='flex flex-wrap gap-4 w-full items-center mb-2'>
            <div>Total Payout Volume: {appState.utils.formatter.format(payout)}</div>
            <div>Total TVL for the hackathon: {appState.utils.formatter.format(TVL)}</div>
          </div>
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
            {!loadingBounties && filteredItems?.length == 0 && (
              <div className='bg-info border-info-strong border-2 p-3 rounded-sm mb-4 text-center'>
                No Bounties Found
              </div>
            )}
            {loadingBounties && filteredItems?.length == 0 && (
              <div className='flex justify-center items-center bg-info border-info-strong border-2 p-3 rounded-sm mb-4'>
                Loading... <LoadingIcon />
              </div>
            )}
            <div className='flex flex-col mb-4 lg:min-w-[1000px] overflow-x-auto border border-web-gray rounded-sm p-4'>
              <div className='mb-2'>Filter by:</div>
              <div className='mb-2 text-sm text-mute italic'>
                Note that all search input must be an exact match for the search fields below.
              </div>
              <div className={`items-center gap-4 ${gridFormat} border-b border-web-gray pb-2 mb-2 font-bold`}>
                <div className=''>TierWinner</div>
                <div className='flex justify-center'>Planned</div>
                <div className='flex justify-center'>W8/W9?</div>
                <div className='flex justify-center'>KYC'd?</div>
                <div className='flex justify-center'>Wallet</div>
                <div className='flex justify-center'>Paid out</div>
              </div>
              <div className={`items-center gap-4 ${gridFormat} pb-2 mb-2 text-sm`}>
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

                <div className='flex justify-center'>---</div>
                <select id='w8' name='w8' className='input-field px-1' defaultValue={'all'} onChange={handleSelect}>
                  <option value='all'></option>
                  <option value='approved'>APPROVED</option>
                  <option value='pending'>PENDING</option>
                  <option value='not sent'>NOT SENT</option>
                </select>
                {account ? (
                  <select id='kyc' name='kyc' className='input-field px-1' defaultValue={'all'} onChange={handleSelect}>
                    <option value='all'></option>
                    <option value='true'>TRUE</option>
                    <option value='false'>FALSE</option>
                  </select>
                ) : (
                  <div className='flex justify-center'>n.a.*</div>
                )}
                <div className='flex justify-center'>
                  <input
                    className='flex input-field w-28'
                    id='walletAddress'
                    placeholder='Address...'
                    value={walletAddress}
                    onChange={handleSearchInput}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <select
                  id='claimed'
                  name='claimed'
                  className='input-field px-1'
                  defaultValue={'all'}
                  onChange={handleSelect}
                >
                  <option value='all'></option>
                  <option value='true'>TRUE</option>
                  <option value='false'>FALSE</option>
                </select>
              </div>
            </div>
            {filteredItems.map((item) => {
              return (
                <div key={item.bountyId}>
                  <ClaimsPerBounty
                    item={item}
                    setFilteredInfo={setFilteredInfo}
                    filteredInfo={filteredInfo}
                    filters={filters}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default ClaimsTracking;
