import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import Jazzicon from '../Utils/Jazzicon';
import useEns from '../../hooks/useENS';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import { ethers } from 'ethers';
import ClaimPerToken from './ClaimPerToken';

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

  const claimantTotalValue = (claimant) => {
    /* const claimed = tokenAddresses.map((tokenAddress) =>
      claimantBalances(claimant, tokenAddress).reduce((a, b) => a + b)
    ); */
    return 0; // appState.utils.formatter.format(claimed);
  };

  const claimedVolume = (tokenAddress) => {
    const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
    const volume = bounty.payouts
      ?.filter((payout) => payout.tokenAddress == tokenAddress)
      .map((payout) => payout.volume)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const totalDepositVolume = (tokenAddress) => {
    const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
    const volume = bounty.deposits
      .filter((deposit) => deposit.tokenAddress == tokenAddress)
      .map((deposit) => deposit.volume)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const stillClaimable = (tokenAddress) => {
    const getBalances = () => {
      return bounty.bountyTokenBalances
        ? bounty.bountyTokenBalances.filter((balances) => balances.tokenAddress == tokenAddress)
        : null;
    };
    const balanceObj = useMemo(() => getBalances(), [tokenAddress]);
    const [balanceValues] = useGetTokenValues(balanceObj);
    return balanceValues?.total;
  };

  const totalDepositBalance = (tokenAddress) => {
    const getBalances = () => {
      return bounty.payouts ? bounty.payouts.filter((payout) => payout.tokenAddress == tokenAddress) : null;
    };
    const balanceObj = useMemo(() => getBalances(tokenAddress), [tokenAddress]);
    const [balanceValues] = useGetTokenValues(balanceObj);
    return balanceValues?.total + stillClaimable(tokenAddress);
  };

  const getBalancesStillClaimable = () => {
    return bounty.bountyTokenBalances ? bounty.bountyTokenBalances : null;
  };
  const balanceObjStillClaimable = useMemo(() => getBalancesStillClaimable(), [bounty]);
  const [balanceValuesStillClaimable] = useGetTokenValues(balanceObjStillClaimable);
  const stillClaimableValue = balanceValuesStillClaimable?.total;

  const getBalancesDeposits = () => {
    return bounty.deposits ? bounty.deposits : null;
  };
  const balanceObjDeposits = useMemo(() => getBalancesDeposits(), [bounty]);
  const [balanceValuesDeposits] = useGetTokenValues(balanceObjDeposits);
  const totalDepositValue = balanceValuesDeposits?.total + stillClaimableValue;

  return (
    <div>
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
                    <ClaimPerToken
                      bounty={bounty}
                      claimant={claimant}
                      tokenAddress={tokenAddress}
                      totalDepositVolume={totalDepositVolume}
                    />
                  </td>
                ))}
                <td className='px-2 pb-2 text-center'>
                  <td className='px-2 pb-2 text-center'>{bounty.payouts ? <div>OK</div> : '0.0'}</td>
                  <td className='px-2 pb-2 text-center'>
                    {bounty.payouts ? <div>{claimantTotalValue(claimant)}</div> : '0.0'}
                  </td>
                </td>
              </tr>
            </>
          ))}
          <tr className='font-bold items-center border-t border-gray-700'>
            <td className='px-2 pb-2'>SubTotal</td>
            {bounty.payouts &&
              tokenAddresses.map((tokenAddress) => (
                <td key={tokenAddress}>
                  <ClaimPerToken
                    bounty={bounty}
                    claimants={claimants}
                    tokenAddress={tokenAddress}
                    totalDepositVolume={totalDepositVolume}
                  />
                </td>
              ))}
            <td className='px-2 pb-2 text-center'>
              <td className='px-2 pb-2 text-center'>{bounty.payouts ? <div>OK</div> : '0.0'}</td>
              <td className='px-2 pb-2 text-center'>{bounty.payouts ? <div>BIS</div> : '0.0'}</td>
            </td>
          </tr>
          <tr>
            <td className='px-2'>Still Claimable</td>
            {tokenAddresses.map((tokenAddress) => (
              <td key={tokenAddress} className='px-2 text-center'>
                <td className='px-2 text-center' key={tokenAddress + 1}>
                  {parseFloat(totalDepositVolume(tokenAddress) - claimedVolume(tokenAddress)).toFixed(1)}
                </td>
                <td className='px-2 text-center' key={tokenAddress + 2}>
                  {(
                    parseFloat(
                      (totalDepositVolume(tokenAddress) - claimedVolume(tokenAddress)) /
                        totalDepositVolume(tokenAddress)
                    ) * 100
                  ).toFixed(1)}{' '}
                  %
                </td>
                <td className='px-2 text-center' key={tokenAddress + 3}>
                  {appState.utils.formatter.format(stillClaimable(tokenAddress))}
                </td>
              </td>
            ))}
            <td className='px-2 text-center'>
              <td className='px-2 text-center'>
                {bounty.payouts ? (
                  <div>{parseFloat((stillClaimableValue / totalDepositValue) * 100).toFixed(1)} %</div>
                ) : (
                  '0.0'
                )}
              </td>
              <td className='px-2 text-center'>
                {bounty.payouts ? <div>{appState.utils.formatter.format(stillClaimableValue)}</div> : '0.0'}
              </td>
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
            <td className='px-2 pb-2 text-center'>
              <td className='px-2 pb-2 text-center'>{bounty.payouts ? <div>OK</div> : '0.0'}</td>
              <td className='px-2 pb-2 text-center'>{bounty.payouts ? <div>BIS</div> : '0.0'}</td>
            </td>
          </tr>
          <tr className='font-bold items-center border-t border-gray-700'>
            <td className='px-2 pb-2'>Total Deposited (tooltip: excl. refunded)</td>
            {tokenAddresses.map((tokenAddress) => (
              <td key={tokenAddress} className='px-2 pb-2 text-center'>
                <td className='px-2 pb-2 text-center' key={tokenAddress + 1}>
                  {totalDepositVolume(tokenAddress)}
                </td>
                <td className='px-2 pb-2 text-center' key={tokenAddress + 2}>
                  100 %
                </td>
                <td className='px-2 pb-2 text-center' key={tokenAddress + 3}>
                  {appState.utils.formatter.format(totalDepositBalance(tokenAddress))}
                </td>
              </td>
            ))}
            <td className='px-2 pb-2 text-center'>
              <td className='px-2 pb-2 text-center'>{bounty.deposits ? <div>100%</div> : '0.0'}</td>
              <td className='px-2 pb-2 text-center'>
                {bounty.deposits ? <div>{appState.utils.formatter.format(totalDepositValue)}</div> : '0.0'}
              </td>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ClaimOverview;
