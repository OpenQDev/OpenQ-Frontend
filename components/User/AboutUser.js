// Third party
import React from 'react';
// Custom
import useGetTokenValues from '../../hooks/useGetTokenValues';
import UserHistory from './OverviewTab/UserHistory';
import MiniBountyList from './OverviewTab/MiniBountyList';
import MiniDepositList from './OverviewTab/MiniDepositList';
import Balances from './OverviewTab/Balances';
import useEns from '../../hooks/useENS';
import AboutTitle from './OverviewTab/AboutTitle';

const AboutUser = ({ user, organizations }) => {
  const { fundedTokenBalances, bountiesCreated, bountiesClosed, deposits, payoutTokenBalances, payouts } = user;
  const account = user.id;
  const [ensName] = useEns(account);
  // Context

  // State
  const [payoutTokenValues] = useGetTokenValues(payoutTokenBalances);
  const [fundedTokenValues] = useGetTokenValues(fundedTokenBalances);

  return (
    <>
      <AboutTitle ensName={ensName} account={account} />
      <UserHistory organizations={organizations} payouts={payouts} />
      <Balances tokenBalances={fundedTokenBalances} tokenValues={fundedTokenValues} type='Total Contributions' />
      <Balances tokenBalances={payoutTokenBalances} tokenValues={payoutTokenValues} type='Total Payouts' />
      <MiniBountyList bounties={bountiesClosed} type={'Claimed'} />
      <MiniBountyList bounties={bountiesCreated} type={'Minted'} />
      <MiniDepositList deposits={deposits} />
    </>
  );
};

export default AboutUser;
