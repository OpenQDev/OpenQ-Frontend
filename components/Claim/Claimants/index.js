import React from 'react';
import useEns from '../../../hooks/useENS';
import Jazzicon from '../../Utils/Jazzicon';

const Claimants = ({ claimant }) => {
  const shortenAddress = (address) => {
    if (!address) {
      return '';
    }
    return `${address.slice(0, 4)}...${address.slice(38)}`;
  };
  const [claimantEnsName] = useEns(claimant);
  return (
    <div className='flex gap-4 items-center px-2 pb-2' key={claimant + 1}>
      <Jazzicon tooltipPosition={'-left-2'} size={36} address={claimant} />
      <span>{claimantEnsName || shortenAddress(claimant)}</span>
    </div>
  );
};
export default Claimants;
