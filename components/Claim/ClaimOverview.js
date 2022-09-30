import React, { useContext, useState, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import ClaimPerToken from './ClaimPerToken';
import ClaimTotals from './ClaimTotals';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import ToolTipNew from '../Utils/ToolTipNew';
import Claimants from './Claim/Claimants.js';

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
    if (claimant in sum && value) {
      setSum((prev) => ({ ...prev, [claimant]: prev[claimant] + value }));
    }
    if (!(claimant in sum) && value) {
      setSum((prev) => ({ ...prev, [claimant]: value }));
    }
  };

  let title = '';
  let styles = '';
  let toolTipText = '';

  function switchType(type) {
    switch (type) {
      case 'perClaimant':
        break;
      case 'allClaimants':
        title = 'SubTotal';
        styles = 'font-bold border-t border-gray-700';
        break;
      case 'stillClaimable':
        title = 'Still Claimable';
        styles = '';
        break;
      case 'refundable':
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
        styles = 'italic';
        break;
      case 'refunded':
        title = 'Refunded';
        styles = '';
        break;
      case 'total':
        title = 'Total Deposited';
        toolTipText = 'Everything that has ever been deposited on this bounty. Includes refunded and claimed amounts.';
        styles = 'font-bold border-t border-gray-700';
        break;
    }
  }

  return (
    <>
      <div className='flex w-[800px] overflow-auto h-1/2'>
        {bounty.payouts?.length ? (
          <div className='flex flex-col pb-12'>
            <div className='grid grid-cols-[250px_1fr]'>
              <div className='px-2 pb-2'></div>
              <div className='grid grid-flow-col auto-cols-auto'>
                {tokenAddresses.map((token) => (
                  <div key={token} className='px-2 pb-2 text-center'>
                    {appState.tokenClient.getToken(token).symbol}
                  </div>
                ))}
                {tokenAddresses.length > 1 && <div className='px-2 pb-2 text-center'>TOTAL</div>}
              </div>
            </div>
            <div className=''>
              {claimants.map((claimant) => (
                <div key={claimant} className='grid grid-cols-[250px_1fr]'>
                  <Claimants claimant={claimant} />
                  <div className='grid grid-flow-col auto-cols-auto'>
                    {tokenAddresses.map((tokenAddress) => (
                      <ClaimPerToken
                        key={tokenAddress}
                        bounty={bounty}
                        claimant={claimant}
                        tokenAddress={tokenAddress}
                        type={'perClaimant'}
                        changeObj={changeObj}
                      />
                    ))}
                    {tokenAddresses.length > 1 && (
                      <ClaimTotals
                        key={claimant + 1}
                        valueDisplay={sum[claimant]}
                        totalDepositValue={totalDepositValue}
                      />
                    )}
                  </div>
                </div>
              ))}

              {types.map((type) => (
                <div key={type}>
                  {switchType(type)}
                  <div className={`grid grid-cols-[250px_1fr] ${styles}`}>
                    <div className='px-2 pb-2'>
                      {type === 'refundable' || type === 'total' ? (
                        <div className='flex gap-1 items-center whitespace-nowrap'>
                          {title}
                          <ToolTipNew
                            relativePosition={'-left-5'}
                            outerStyles={'relative bottom-1'}
                            innerStyles={'whitespace-normal w-96'}
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
                          <ClaimPerToken
                            key={tokenAddress}
                            bounty={bounty}
                            tokenAddress={tokenAddress}
                            type={type}
                            changeObj={changeObj}
                          />
                        ))}
                      {tokenAddresses.length > 1 && (
                        <ClaimTotals valueDisplay={sum[type]} totalDepositValue={totalDepositValue} />
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
