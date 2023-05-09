import { useState, useEffect } from 'react';
import { formatCurrency } from '../services/utils/lib';
import useGetTokenValues from './useGetTokenValues';
import { ethers } from 'ethers';
import useGetValueFromComposite from './useGetValueFromComposite';

const useDisplayValue = (bounty) => {
  //takes in bounty and returns correct value object
  /*
	@type
	{
		'budget' : budget,
		"tvc" : "total value claimed",
		"tvl" : "total value locked",
		"budget": "budget",
		"priorityValue":"highest value",
	}
	*/

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
  const setDisplayValues = (budget = 0, tvc = 0, tvl = 0) => {
    const baseValueObj = {
      budget: formatCurrency(budget),
      budgetRaw: budget,
      tvc: formatCurrency(tvc),
      tvcRaw: tvc,
      tvl: formatCurrency(tvl),
      tvlRaw: tvl,
      priorityValue: tvl,
    };
    // TODO ensure fuzzy solvency is correct
    const smallerBudget = budget - 1;
    const tvlPrimary = tvl >= smallerBudget && true;
    if (bounty.status !== '0') {
      if (tvl - tvc > tvc / 50) {
        baseValueObj.priorityValue = 'tvl';
      } else {
        baseValueObj.priorityValue = 'tvc';
      }
    } else if (tvlPrimary) {
      baseValueObj.priorityValue = 'tvl';
    } else if (budget) {
      baseValueObj.priorityValue = 'budget';
    } else if (budget === 0) {
      baseValueObj.priorityValue = 'budget';
    }
    return baseValueObj;
  };
  let budget;
  const tvc = payoutPrice?.total || bounty.tvc || 0;
  const tvl = tokenValues?.total || bounty.tvl || 0;
  const isFixedContest = bounty.bountyType === '3' && bounty.payoutSchedule;
  if (isFixedContest) {
    if (payoutScheduledValue) {
      budget = payoutScheduledValue.total;
    }
  } else {
    budget = budgetValue?.total;
  }
  useEffect(() => {
    if (bounty) {
      setValueObj(setDisplayValues(budget, tvc, tvl));
    }
  }, [bounty, budget, tvc, tvl]);
  return valueObj;
};
export default useDisplayValue;
