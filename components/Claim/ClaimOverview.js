import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import Jazzicon from '../Utils/Jazzicon';
import useEns from '../../hooks/useENS';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import { ethers } from 'ethers';

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

  const claimantBalances = (claimant, tokenAddress) => {
    const getBalances = () => {
      return claimant
        ? bounty.payouts.filter((payout) => payout.closer.id == claimant && payout.tokenAddress == tokenAddress)
        : null;
    };
    const balanceObj = useMemo(() => getBalances(), [tokenAddress]);
    const [balanceValues] = useGetTokenValues(balanceObj);
    return balanceValues?.total;
  };

  const claimedBalances = (tokenAddress) => {
    const claimed = claimants.map((claimant) => claimantBalances(claimant, tokenAddress)).reduce((a, b) => a + b);
    return appState.utils.formatter.format(claimed);
  };

  const claimantVolume = (claimant, tokenAddress) => {
    const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
    const volume = bounty.payouts.filter(
      (payout) => payout.closer.id == claimant && payout.tokenAddress == tokenAddress
    )[0].volume;
    let bigNumberVolume = ethers.BigNumber.from(volume.toString());
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
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

  const totalDeposit = (tokenAddress) => {
    const tokenMetadata = appState.tokenClient.getToken(tokenAddress);
    const volume = bounty.deposits
      .filter((deposit) => deposit.tokenAddress == tokenAddress)
      .map((deposit) => deposit.volume)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    let bigNumberVolume = ethers.BigNumber.from(volume.toLocaleString('fullwide', { useGrouping: false }));
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    return ethers.utils.formatUnits(bigNumberVolume, decimals);
  };

  const claimantPercent = (claimant, tokenAddress) => {
    return (claimantVolume(claimant, tokenAddress) / totalDeposit(tokenAddress)) * 100;
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className='p-2'></th>
            {tokenAddresses.map((token) => (
              <th key={token} className='p-2'>
                {appState.tokenClient.getToken(token).symbol}
                <div className='flex justify-between p-2'>
                  <th className='p-2'>Vol</th>
                  <th className='p-2'>%</th>
                  <th className='p-2'>$</th>
                </div>
              </th>
            ))}
            <th className='p-2'>
              TOTAL
              <div className='flex justify-between p-2'>
                <th className='p-2'>%</th>
                <th className='p-2'>$</th>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {claimants.map((claimant, index) => (
            <>
              <tr key={claimant}>
                <td className='flex gap-4 items-center p-2' key={claimant}>
                  <Jazzicon tooltipPosition={'-left-2'} size={36} address={claimant} />
                  <span>{claimantsShort[index]}</span>
                </td>
                {tokenAddresses.map((tokenAddress) => (
                  <td key={tokenAddress} className='p-2 text-center'>
                    <td className='p-2 text-center' key={tokenAddress + 1}>
                      {bounty.payouts?.some((payout) => payout.closer.id == claimant) ? (
                        <>{claimantVolume(claimant, tokenAddress)}</>
                      ) : (
                        '0.0'
                      )}
                    </td>
                    <td className='p-2 text-center' key={tokenAddress + 2}>
                      {bounty.payouts?.some((payout) => payout.closer.id == claimant) ? (
                        <>{claimantPercent(claimant, tokenAddress)} %</>
                      ) : (
                        '0.0'
                      )}
                    </td>
                    <td className='p-2 text-center' key={tokenAddress + 3}>
                      {bounty.payouts?.some((payout) => payout.closer.id == claimant) ? (
                        <>{appState.utils.formatter.format(claimantBalances(claimant, tokenAddress))}</>
                      ) : (
                        '0.0'
                      )}
                    </td>
                  </td>
                ))}
                <td className='flex justify-between p-2 text-center'>
                  <td className='p-2 text-center'>{bounty.payouts ? <div>OK</div> : '0.0'}</td>
                  <td className='p-2 text-center'>{bounty.payouts ? <div>BIS</div> : '0.0'}</td>
                </td>
              </tr>
            </>
          ))}
          <tr className='font-bold items-center border-t border-gray-700'>
            <td className='p-2'>SubTotal</td>
            {tokenAddresses.map((tokenAddress) => (
              <td key={tokenAddress} className='p-2 text-center'>
                <td className='p-2 text-center' key={tokenAddress + 1}>
                  {bounty.payouts ? <>{claimedVolume(tokenAddress)}</> : '0.0'}
                </td>
                <td className='p-2 text-center' key={tokenAddress + 2}>
                  {bounty.payouts ? <>{(claimedVolume(tokenAddress) / totalDeposit(tokenAddress)) * 100} %</> : '0.0'}
                </td>
                <td className='p-2 text-center' key={tokenAddress + 3}>
                  {bounty.payouts ? <>{claimedBalances(tokenAddress)}</> : '0.0'}
                </td>
              </td>
            ))}
            <td className='p-2 text-center'>
              <td className='p-2 text-center'>{bounty.payouts ? <div>OK</div> : '0.0'}</td>
              <td className='p-2 text-center'>{bounty.payouts ? <div>BIS</div> : '0.0'}</td>
            </td>
          </tr>
          <tr>
            <td className='p-2'>Still Claimable</td>
            {tokenAddresses.map((tokenAddress) => (
              <td key={tokenAddress} className='p-2 text-center'>
                <td className='p-2 text-center' key={tokenAddress + 1}>
                  1
                </td>
                <td className='p-2 text-center' key={tokenAddress + 2}>
                  2
                </td>
                <td className='p-2 text-center' key={tokenAddress + 3}>
                  3
                </td>
              </td>
            ))}
            <td className='p-2 text-center'>
              <td className='p-2 text-center'>{bounty.payouts ? <div>OK</div> : '0.0'}</td>
              <td className='p-2 text-center'>{bounty.payouts ? <div>BIS</div> : '0.0'}</td>
            </td>
          </tr>
          <tr className='italic'>
            <td className='p-2'>of which currently refundable</td>
            {tokenAddresses.map((tokenAddress) => (
              <td key={tokenAddress} className='p-2 text-center'>
                <td className='p-2 text-center' key={tokenAddress + 1}>
                  1
                </td>
                <td className='p-2 text-center' key={tokenAddress + 2}>
                  2
                </td>
                <td className='p-2 text-center' key={tokenAddress + 3}>
                  3
                </td>
              </td>
            ))}
            <td className='p-2 text-center'>
              <td className='p-2 text-center'>{bounty.payouts ? <div>OK</div> : '0.0'}</td>
              <td className='p-2 text-center'>{bounty.payouts ? <div>BIS</div> : '0.0'}</td>
            </td>
          </tr>
          <tr className='font-bold items-center border-t border-gray-700'>
            <td className='p-2'>Total Deposit</td>
            {tokenAddresses.map((tokenAddress) => (
              <td key={tokenAddress} className='p-2 text-center'>
                <td className='p-2 text-center' key={tokenAddress + 1}>
                  1
                </td>
                <td className='p-2 text-center' key={tokenAddress + 2}>
                  2
                </td>
                <td className='p-2 text-center' key={tokenAddress + 3}>
                  3
                </td>
              </td>
            ))}
            <td className='p-2 text-center'>
              <td className='p-2 text-center'>{bounty.payouts ? <div>OK</div> : '0.0'}</td>
              <td className='p-2 text-center'>{bounty.payouts ? <div>BIS</div> : '0.0'}</td>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ClaimOverview;
