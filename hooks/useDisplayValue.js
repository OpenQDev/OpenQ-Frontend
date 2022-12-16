import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import useGetTokenValues from './useGetTokenValues';
import useGetValueFromComposite from './useGetValueFromComposite';

const useDisplayValue = (bounty, formatter, type) => {
  //takes in bounty and returns correct value object
  const [valueObj, setValueObj] = useState();
  const [payoutPrice] = useGetTokenValues(bounty?.payouts);
  const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances);
  const getPayoutScheduleBalance = (bounty) => {
    const totalPayoutsScheduled = bounty.payoutSchedule?.reduce((acc, payout) => {
      return ethers.BigNumber.from(acc).add(ethers.BigNumber.from(payout));
    });
    return {
      volume: totalPayoutsScheduled?.toLocaleString('fullwide', { useGrouping: false }),
      tokenAddress: bounty.payoutTokenAddress,
    };
  };
  const payoutScheduledBalance = getPayoutScheduleBalance(bounty);
  const [payoutScheduledValue] = useGetValueFromComposite(
    payoutScheduledBalance.tokenAddress,
    payoutScheduledBalance.volume
  );
  const [budgetValue] = useGetValueFromComposite(bounty.fundingGoalTokenAddress, bounty.fundingGoalVolume);
  const setDisplayValues = (budget, tvc, tvl) => {
    const hasTvl = (tvl > budget && type !== 'budget') || type === 'actual';
    if (bounty.status !== '0') {
      setValueObj({
        value: tvc,
        valueType: 'TVC',
        valueTypeFull: 'Total Value Claimed',
        displayValue: formatter(tvc),
        imgSrc: '/crypto-logos/ETH-COLORED.png',
      });
    } else if (hasTvl) {
      setValueObj({
        value: tvl,
        valueType: 'TVL',
        valueTypeFull: 'Total Value Locked',
        displayValue: formatter(tvl),
        imgSrc: '/crypto-logos/ETH-COLORED.png',
      });
    } else if (budget) {
      setValueObj({
        value: budget,
        valueType: 'Budget',
        valueTypeFull: 'Budget',
        displayValue: formatter(budget),
      });
    } else if (budget === 0) {
      setValueObj({
        value: null,
        valueType: 'Budget',
        valueTypeFull: 'Budget',
        displayValue: null,
      });
    }
  };
  useEffect(() => {
    let budget;
    const tvc = bounty.tvc || payoutPrice?.total || 0;
    const tvl = tokenValues?.total || bounty.tvl || 0;
    const isFixedContest = bounty.bountyType === '3' && bounty.payoutSchedule;
    if (isFixedContest) {
      if (payoutScheduledValue) {
        budget = payoutScheduledValue.total;
      }
    } else {
      budget = budgetValue?.total;
    }
    setDisplayValues(budget, tvc, tvl);
  }, [payoutPrice, tokenValues, payoutScheduledValue, budgetValue]);

  return valueObj;
};
export default useDisplayValue;
