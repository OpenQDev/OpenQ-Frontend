import { getUnclaimedTierWithVolume } from '../../lib/batchUtils';
import { ethers } from 'ethers';

describe('Batch Mint - Supporting Docs', () => {
  it('should return correct tier', async () => {
    const tierWinners = ['USER1', '', '', '', ''];

    const twelve = ethers.BigNumber.from('1250000000');
    const fivehundred = ethers.BigNumber.from('5000000000');

    const payoutSchedule = [twelve, twelve, fivehundred, twelve, twelve];

    const tiersClaimedPreviouslyInBatch = [1];

    const bigNumberTierVolume = ethers.BigNumber.from('1250000000');

    const tier = getUnclaimedTierWithVolume(
      payoutSchedule,
      tierWinners,
      tiersClaimedPreviouslyInBatch,
      bigNumberTierVolume
    );

    expect(tier).toEqual(3);
  });

  it('should return null if no tier', async () => {
    const tierWinners = ['USER1', '', '', '', ''];

    const twelve = ethers.BigNumber.from('1250000000');
    const fivehundred = ethers.BigNumber.from('5000000000');

    const payoutSchedule = [twelve, twelve, fivehundred, twelve, twelve];

    const tiersClaimedPreviouslyInBatch = [1, 2, 3, 4];

    const bigNumberTierVolume = ethers.BigNumber.from('1250000000');

    const tier = getUnclaimedTierWithVolume(
      payoutSchedule,
      tierWinners,
      tiersClaimedPreviouslyInBatch,
      bigNumberTierVolume
    );

    expect(tier).toEqual(null);
  });
});
