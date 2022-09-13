import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import Jazzicon from '../Utils/Jazzicon';
import useEns from '../../hooks/useENS';

// get bounty info
// cols => bounty.deposits => list of token addresses (3 subcolumns => vol / % / $ value)
// end of cols => sum col value in $ total
// rows => bounty.payouts.closer.id (with jazzicon like AB) => payouts.volume per tokenAddress (and % total deposit & $ value)
// subsum row
// "rest" row => still available for claim
// "total" value deposited

// design => flexbox => 1 element left = list of claimants // then 1 component repeated per tokenAdress // 1 element right = sum
// height of each fixed - middle with scroll // end fixed
// bottom fixed
// => or table react

const ClaimOverview = ({ bounty }) => {
  const [appState] = useContext(StoreContext);
  const shortenAddress = (address) => {
    if (!address) {
      return '';
    }
    return `${address.slice(0, 4)}...${address.slice(38)}`;
  };
  const tokenAdresses = bounty.deposits
    .map((deposit) => appState.tokenClient.getToken(deposit.tokenAddress).symbol)
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

  console.log(claimants);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className='p-2'></th>
            {tokenAdresses.map((token) => (
              <th key={token} className='p-2'>
                {token}
              </th>
            ))}
            <th className='p-2'>Total</th>
          </tr>
        </thead>
        <tbody>
          {claimants.map((address, index) => (
            <tr key={address}>
              <td className='flex gap-4 items-center p-2' key={address}>
                <Jazzicon tooltipPosition={'-left-2'} size={36} address={address} />
                <span>{claimantsShort[index]}</span>
              </td>
              {tokenAdresses.map((item) => (
                <td className='p-2' key={item}>
                  {item}
                </td>
              ))}
              <td className='p-2'>Total</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimOverview;
