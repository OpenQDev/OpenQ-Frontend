import { getUnclaimedTierWithVolume } from '../../lib/batchUtils';
import { ethers } from 'ethers';

describe('Batch Mint - Tier Winner', () => {
  it('should pass', async () => {
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
});
