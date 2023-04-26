import { formatCurrency } from '../services/utils/lib';

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

  const setDisplayValues = (budget = 0, tvc = 0, tvl = 0) => {
    const baseValueObj = {
      budget: formatCurrency(budget),
      tvc: formatCurrency(tvc),
      tvl: formatCurrency(tvl),
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
  const tvc = bounty.tvc;
  const tvl = bounty.tvl;
  const budget = bounty.budgetValue;
  return setDisplayValues(budget, tvc, tvl);
};
export default useDisplayValue;
