import React, { useContext, useState, useMemo, useEffect } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import ClaimPerToken from './ClaimPerToken';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import ToolTipNew from '../Utils/ToolTipNew';
import Claimants from './Claimants.js';

const ClaimOverview = ({ bounty, setInternalMenu }) => {
  const [appState] = useContext(StoreContext);
  const types = ['allClaimants', 'stillClaimable', 'refundable', 'refunded', 'total'];
  const tokenAddresses = bounty.deposits
    .map((deposit) => deposit.tokenAddress)
    .filter((itm, pos, self) => {
      return self.indexOf(itm) == pos;
    });
  const claimants = bounty.payouts
    ?.map((payout) => payout.closer.id)
    .filter((itm, pos, self) => {
      return self.indexOf(itm) == pos;
    });

  let allTypes = claimants.concat(types);
  useEffect(() => {
    allTypes = claimants.concat(types);
  }, [bounty]);

  function filterAndAggregate(toFilterPerToken) {
    return tokenAddresses.map((tokenAddress) => {
      const array = toFilterPerToken.filter((element) => element.tokenAddress == tokenAddress);
      const volume =
        array.map((element) => element.volume).reduce((a, b) => parseInt(a) + parseInt(b), 0) || array[0]?.volume;
      return { tokenAddress: tokenAddress, volume: volume } || null;
    });
  }

  const balanceObjDeposits = useMemo(() => filterAndAggregate(bounty.deposits), [bounty]);
  const [balanceValuesDeposits] = useGetTokenValues(balanceObjDeposits);
  const totalDepositValue = balanceValuesDeposits?.total ? balanceValuesDeposits?.total : 0;

  const [sum, setSum] = useState({});

  const changeObj = (claimant, value) => {
    if (claimant in sum && value >= 0) {
      setSum((prev) => ({ ...prev, [claimant]: prev[claimant] + value }));
    }
    if (!(claimant in sum) && value >= 0) {
      setSum((prev) => ({ ...prev, [claimant]: value }));
    }
  };

  let title = '';
  let styles = '';
  let toolTipText = '';

  function switchType(type) {
    switch (true) {
      case type[0] === '0':
        title = <Claimants claimant={type} />;
        break;
      case type === 'allClaimants':
        title = 'SubTotal';
        styles = 'font-bold border-t border-gray-700 py-2';
        break;
      case type === 'stillClaimable':
        title = 'Still Claimable';
        styles = 'pb-2';
        break;
      case type === 'refundable':
        title = (
          <div>
            of which currently{' '}
            <button className='italic text-link-colour hover:underline' onClick={() => setInternalMenu('Refund')}>
              refundable
            </button>
          </div>
        );
        toolTipText =
          'Funds that are currently not locked (deposit lock period expired) and have not already been used for claims. Claims will be deducted from deposits with earliest expiration date first.';
        styles = 'italic pb-2';
        break;
      case type === 'refunded':
        title = 'Refunded';
        styles = 'pb-2';
        break;
      case type === 'total':
        title = 'Total Deposited';
        toolTipText = 'Everything that has ever been deposited on this bounty, incl. refunded and claimed amounts.';
        styles = 'font-bold border-t border-gray-700 py-2';
        break;
    }
  }

  return (
    <>
      <div className='flex w-[800px] overflow-auto h-1/2'>
        {bounty.payouts?.length ? (
          <div className={`flex flex-col pb-6 ${tokenAddresses.length > 1 ? '' : 'w-full'}`}>
            <div
              className={`grid ${
                tokenAddresses.length > 1
                  ? 'grid-cols-[250px_1fr_172px]'
                  : 'grid-cols-[140px_250px] sm:grid-cols-[1fr_250px]'
              }`}
            >
              <div className='px-2 pb-2'></div>
              <div className='grid grid-flow-col auto-cols-fr'>
                {tokenAddresses.map((token) => (
                  <div key={token} className='px-2 pb-2 text-center '>
                    {appState.tokenClient.getToken(token).symbol}
                  </div>
                ))}
              </div>
              {tokenAddresses.length > 1 && <div className='px-2 pb-2 text-center'>TOTAL</div>}
            </div>
            <div>
              {allTypes.map((type) => (
                <div key={type}>
                  {switchType(type)}
                  <div
                    className={`grid ${
                      tokenAddresses.length > 1
                        ? 'grid-cols-[250px_1fr]'
                        : 'grid-cols-[140px_250px] sm:grid-cols-[1fr_250px]'
                    } ${styles}`}
                  >
                    <div className=''>
                      {type === 'refundable' || type === 'total' ? (
                        <div className='flex gap-1 items-center sm:whitespace-nowrap'>
                          {title}
                          <ToolTipNew
                            relativePosition={'-left-5'}
                            outerStyles={'relative bottom-1'}
                            innerStyles={'whitespace-normal w-[520px]'}
                            toolTipText={toolTipText}
                          >
                            <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                              ?
                            </div>
                          </ToolTipNew>
                        </div>
                      ) : (
                        title
                      )}
                    </div>
                    <div className='grid grid-flow-col auto-cols-auto'>
                      {bounty.payouts?.length &&
                        tokenAddresses.map((tokenAddress) => (
                          <div key={tokenAddress} className='flex'>
                            <ClaimPerToken
                              key={tokenAddress}
                              bounty={bounty}
                              tokenAddress={tokenAddress}
                              claimant={type}
                              type={type}
                              changeObj={changeObj}
                            />
                          </div>
                        ))}
                      {tokenAddresses.length > 1 && (
                        <div className='grid grid-cols-[1fr_1fr] px-2 pb-2'>
                          <div className='flex justify-end self-center px-1 mr-1 whitespace-nowrap w-14'>
                            {totalDepositValue > 0 ? ((sum[type] / totalDepositValue) * 100).toFixed(0) : 'n.a.'} %
                          </div>
                          <div className='flex justify-start self-center px-1 whitespace-nowrap w-24'>
                            {appState.utils.formatter.format(sum[type])}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='text-lg'>No claims have been made yet.</div>
        )}
      </div>
    </>
  );
};

export default ClaimOverview;
