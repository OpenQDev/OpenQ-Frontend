import { ethers } from 'ethers';
import { useState } from 'react';
import useGetTokenValues from './useGetTokenValues';
import useGetValueFromComposite from './useGetValueFromComposite';

const useDisplayValue = (bounty, formatter, type) => {
  //takes in bounty and returns correct value object
  const [valueObj, setValueObj] = useState();
  const [payoutPrice] = useGetTokenValues(bounty?.payout);
  let budget;
  const tvc = bounty.tvc || payoutPrice?.total || 0;
  const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances);
  const tvl = tokenValues?.total || bounty.tvl || 0;
  const getPayoutScheduleBalance = (bounty) => {
    const totalPayoutsScheduled = bounty.payoutSchedule?.reduce((acc, payout) => {
      return ethers.BigNumber.from(acc).add(ethers.BigNumber.from(payout));
    });
    return {
      volume: totalPayoutsScheduled.toLocaleString('fullwide', { useGrouping: false }),
      tokenAddress: bounty.payoutTokenAddress,
    };
  };

  if (bounty.bountyType === '3' && bounty.payoutSchedule) {
    const payoutScheduledBalance = getPayoutScheduleBalance(bounty);
    const [payoutScheduledValue] = useGetValueFromComposite(
      payoutScheduledBalance.tokenAddress,
      payoutScheduledBalance.volume
    );
    if (payoutScheduledValue) {
      budget = payoutScheduledValue.total;
    }
  } else {
    const [budgetValue] = useGetValueFromComposite(bounty.fundingGoalTokenAddress, bounty.fundingGoalVolume);
    budget = budgetValue?.total;
  }
  if (!valueObj && valueObj?.value !== 0) {
    if (bounty.status !== '0') {
      setValueObj({
        value: tvc,
        valueType: 'TVC',
        valueTypeFull: 'Total Value Claimed',
        displayValue: formatter(tvc),
        imgSrc: '/crypto-logos/ETH-COLORED.png',
      });
    } else if ((tvl > budget && type !== 'budget') || (type === 'actual' && tvl !== 0)) {
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
  }
  return valueObj;
};
export default useDisplayValue;
