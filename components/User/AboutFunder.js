// Third party
import React, { useEffect, useRef } from 'react';
import jazzicon from '@metamask/jazzicon';
// Custom
import useGetTokenValues from '../../hooks/useGetTokenValues';
import useEns from '../../hooks/useENS';
import DepositList from './OverviewTab/DepositList';
import MiniBountyList from './OverviewTab/MiniBountyList';
import Balances from './OverviewTab/Balances';
import AboutTitle from './OverviewTab/AboutTitle';

const AboutFunder = ({ user }) => {
  const { fundedTokenBalances, bountiesCreated, bountiesClosed, deposits } = user;
  const account = user.id;
  const [ensName] = useEns(account);
  // Context

  // State
  const [fundedTokenValues] = useGetTokenValues(fundedTokenBalances);

  const iconWrapper = useRef(null);

  useEffect(() => {
    if (account && iconWrapper.current) {
      iconWrapper.current.innerHTML = '';
      iconWrapper.current.appendChild(jazzicon(32, parseInt(account.slice(2, 10), 16)));
    }
  }, [bountiesClosed]);
  return (
    <>
      <AboutTitle ensName={ensName} account={account} />
      <DepositList deposits={deposits} />
      <Balances tokenBalances={fundedTokenBalances} tokenValues={fundedTokenValues} type='Total Contributions' />
      <MiniBountyList bounties={bountiesCreated} type={'Minted'} />
    </>
  );
};

export default AboutFunder;
