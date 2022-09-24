import React, { useContext, useState, useEffect } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import Jazzicon from '../Utils/Jazzicon';
import useEns from '../../hooks/useENS';
import ClaimPerToken from './ClaimPerToken';
import ClaimTotals from './ClaimTotals';
import ToolTipNew from '../Utils/ToolTipNew';

const ClaimOverview = ({ bounty, setInternalMenu }) => {
  const [appState] = useContext(StoreContext);
  const shortenAddress = (address) => {
    if (!address) {
      return '';
    }
    return `${address.slice(0, 4)}...${address.slice(38)}`;
  };
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
  const claimantsShort = claimants.map((claimant) => {
    const [claimantEnsName] = useEns(claimant);
    return claimantEnsName || shortenAddress(claimant);
  });

  const [sum, setSum] = useState({});

  const changeObj = (claimant, value) => {
    console.log('sum', sum[claimant]);
    console.log('value', value);
    if (claimant in sum && value) {
      setSum((prev) => ({ ...prev, [claimant]: prev[claimant] + value }));
    }
    if (!(claimant in sum) && value) {
      setSum((prev) => ({ ...prev, [claimant]: value }));
    }
  };
  console.log(sum);

  return (
    <div className='pb-8'>
      {bounty.payouts?.length ? (
        <table>
          <thead>
            <tr>
              <th className='px-2 pb-2'></th>
              {tokenAddresses.map((token) => (
                <th key={token} className='px-2 pb-2'>
                  {appState.tokenClient.getToken(token).symbol}
                </th>
              ))}
              <th className='px-2 pb-2'>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {claimants.map((claimant, index) => (
              <tr key={claimant}>
                <td className='flex gap-4 items-center px-2 pb-2' key={claimant + 1}>
                  <Jazzicon tooltipPosition={'-left-2'} size={36} address={claimant} />
                  <span>{claimantsShort[index]}</span>
                </td>
                {tokenAddresses.map((tokenAddress) => (
                  <td key={tokenAddress}>
                    <ClaimPerToken
                      bounty={bounty}
                      claimant={claimant}
                      tokenAddress={tokenAddress}
                      type={'perClaimant'}
                      changeObj={changeObj}
                    />
                  </td>
                ))}
                <td key={claimant + 2}>
                  <ClaimTotals
                    tokenAddresses={tokenAddresses}
                    bounty={bounty}
                    claimant={claimant}
                    type={'perClaimant'}
                  />
                  <div>{sum[claimant]}</div>
                </td>
              </tr>
            ))}
            {/* <tr className='font-bold border-t border-gray-700'>
              <td className='px-2 pb-2'>SubTotal</td>
              {bounty.payouts?.length &&
                tokenAddresses.map((tokenAddress) => (
                  <td key={tokenAddress}>
                    <ClaimPerToken bounty={bounty} tokenAddress={tokenAddress} type={'allClaimants'} />
                  </td>
                ))}
              <td>
                <ClaimTotals tokenAddresses={tokenAddresses} bounty={bounty} type={'allClaimants'} />
              </td>
            </tr>
            <tr>
              <td className='px-2'>Still Claimable</td>
              {tokenAddresses.map((tokenAddress) => (
                <td key={tokenAddress}>
                  <ClaimPerToken bounty={bounty} tokenAddress={tokenAddress} type={'stillClaimable'} />
                </td>
              ))}
              <td>
                <ClaimTotals tokenAddresses={tokenAddresses} bounty={bounty} type={'stillClaimable'} />
              </td>
            </tr>
            <tr className='italic'>
              <td className='flex gap-1 items-center px-2 pb-2'>
                of which currently{' '}
                <button className='italic text-link-colour hover:underline' onClick={() => setInternalMenu('Refund')}>
                  refundable
                </button>
                <ToolTipNew
                  innerStyles={'not-italic whitespace-normal w-80'}
                  toolTipText={
                    'Funds that are currently not locked (deposit lock period expired) and have not already been used for claims. Claims will be deducted from deposits with earliest expiration date first.'
                  }
                >
                  <div className='not-italic cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                    ?
                  </div>
                </ToolTipNew>
              </td>
              {tokenAddresses.map((tokenAddress) => (
                <td key={tokenAddress}>
                  <ClaimPerToken bounty={bounty} tokenAddress={tokenAddress} type={'refundable'} />
                </td>
              ))}
              <td>
                <ClaimTotals tokenAddresses={tokenAddresses} bounty={bounty} type={'refundable'} />
              </td>
            </tr>
            <tr>
              <td className='px-2'>Refunded</td>
              {tokenAddresses.map((tokenAddress) => (
                <td key={tokenAddress}>
                  <ClaimPerToken bounty={bounty} tokenAddress={tokenAddress} type={'refunded'} />
                </td>
              ))}
              <td>
                <ClaimTotals tokenAddresses={tokenAddresses} bounty={bounty} type={'refunded'} />
              </td>
            </tr>
            <tr className='font-bold border-t border-gray-700'>
              <td className='flex items-center gap-2 px-2 pb-2'>
                Total Deposited
                <ToolTipNew
                  innerStyles={'whitespace-normal w-80'}
                  toolTipText={
                    'Everything that has ever been deposited on this bounty. Includes refunded and claimed amounts.'
                  }
                >
                  <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                    ?
                  </div>
                </ToolTipNew>
              </td>

              {tokenAddresses.map((tokenAddress) => (
                <td key={tokenAddress}>
                  <ClaimPerToken bounty={bounty} tokenAddress={tokenAddress} type={'total'} />
                </td>
              ))}
              <td>
                <ClaimTotals tokenAddresses={tokenAddresses} bounty={bounty} type={'total'} />
              </td>
            </tr> */}
          </tbody>
        </table>
      ) : (
        <div className='text-lg'>No claims have been made yet.</div>
      )}
    </div>
  );
};

export default ClaimOverview;
