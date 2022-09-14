import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import Jazzicon from '../Utils/Jazzicon';
import useEns from '../../hooks/useENS';
import ClaimPerToken from './ClaimPerToken';
import ClaimTotals from './ClaimTotals';

const ClaimOverview = ({ bounty }) => {
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
    .map((payout) => payout.closer.id)
    .filter((itm, pos, self) => {
      return self.indexOf(itm) == pos;
    });
  const claimantsShort = claimants.map((claimant) => {
    const [claimantEnsName] = useEns(claimant);
    return claimantEnsName || shortenAddress(claimant);
  });

  return (
    <div className='pb-8'>
      <table>
        <thead>
          <tr>
            <th className='px-2 pb-2'></th>
            {tokenAddresses.map((token) => (
              <th key={token} className='px-2 pb-2'>
                {appState.tokenClient.getToken(token).symbol}
                <div className='flex justify-between px-2 pb-2'>
                  <th className='px-2 pb-2'>Vol</th>
                  <th className='px-2 pb-2'>%</th>
                  <th className='px-2 pb-2'>$</th>
                </div>
              </th>
            ))}
            <th className='px-2 pb-2'>
              TOTAL
              <div className='flex justify-between px-2 pb-2'>
                <th className='px-2 pb-2'>%</th>
                <th className='px-2 pb-2'>$</th>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {claimants.map((claimant, index) => (
            <>
              <tr key={claimant}>
                <td className='flex gap-4 items-center px-2 pb-2' key={claimant}>
                  <Jazzicon tooltipPosition={'-left-2'} size={36} address={claimant} />
                  <span>{claimantsShort[index]}</span>
                </td>
                {tokenAddresses.map((tokenAddress) => (
                  <td key={tokenAddress}>
                    <ClaimPerToken bounty={bounty} claimant={claimant} tokenAddress={tokenAddress} />
                  </td>
                ))}
                <td key={claimant + 1}>
                  <ClaimTotals bounty={bounty} claimant={claimant} />
                </td>
              </tr>
            </>
          ))}
          <tr className='font-bold items-center border-t border-gray-700'>
            <td className='px-2 pb-2'>SubTotal</td>
            {bounty.payouts &&
              tokenAddresses.map((tokenAddress) => (
                <td key={tokenAddress}>
                  <ClaimPerToken bounty={bounty} claimants={claimants} tokenAddress={tokenAddress} />
                </td>
              ))}
            <td>
              <ClaimTotals bounty={bounty} claimants={claimants} />
            </td>
          </tr>
          <tr>
            <td className='px-2'>Still Claimable</td>
            {tokenAddresses.map((tokenAddress) => (
              <td key={tokenAddress}>
                <ClaimPerToken bounty={bounty} tokenAddress={tokenAddress} stillClaim={true} />
              </td>
            ))}
            <td>
              <ClaimTotals bounty={bounty} stillClaim={true} />
            </td>
          </tr>
          <tr className='italic'>
            <td className='px-2 pb-2'>of which currently refundable</td>
            {tokenAddresses.map((tokenAddress) => (
              <td key={tokenAddress} className='px-2 pb-2 text-center'>
                <td className='px-2 pb-2 text-center' key={tokenAddress + 1}>
                  1
                </td>
                <td className='px-2 pb-2 text-center' key={tokenAddress + 2}>
                  2
                </td>
                <td className='px-2 pb-2 text-center' key={tokenAddress + 3}>
                  3
                </td>
              </td>
            ))}
            <td>
              <ClaimTotals bounty={bounty} refundable={true} />
            </td>
          </tr>
          <tr className='font-bold items-center border-t border-gray-700'>
            <td className='px-2 pb-2'>Total Deposited (tooltip: excl. refunded)</td>
            {tokenAddresses.map((tokenAddress) => (
              <td key={tokenAddress}>
                <ClaimPerToken bounty={bounty} tokenAddress={tokenAddress} />
              </td>
            ))}
            <td>
              <ClaimTotals bounty={bounty} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ClaimOverview;
