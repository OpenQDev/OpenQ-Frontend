import { getUnclaimedTierWithVolume } from '../../lib/batchUtils';
import { ethers } from 'ethers';

describe('Batch Mint - Tier Winner', () => {
  it('EMPTY TIER WINNERS + EMPTY PREVIOUSLY SET - should return correct tier', async () => {
    const tierWinners = [];

    const twelve = ethers.BigNumber.from('1250000000');

    const payoutSchedule = [twelve, twelve];

    const tiersClaimedPreviouslyInBatch = [];

    const bigNumberTierVolume = ethers.BigNumber.from('1250000000');

    const tier = getUnclaimedTierWithVolume(
      payoutSchedule,
      tierWinners,
      tiersClaimedPreviouslyInBatch,
      bigNumberTierVolume
    );

    expect(tier).toEqual(0);
  });

  it('EMPTY TIER WINNERS + ONE PREVIOUSLY SET - should return correct tier', async () => {
    const tierWinners = [];

    const twelve = ethers.BigNumber.from('1250000000');

    const payoutSchedule = [twelve, twelve];

    const tiersClaimedPreviouslyInBatch = [0];

    const bigNumberTierVolume = ethers.BigNumber.from('1250000000');

    const tier = getUnclaimedTierWithVolume(
      payoutSchedule,
      tierWinners,
      tiersClaimedPreviouslyInBatch,
      bigNumberTierVolume
    );

    expect(tier).toEqual(1);
  });

  it('ONE TIER WINNER + ONE PREVIOUSLY SET - should return correct tier', async () => {
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

  it('ONE TIER WINNER + MANY PREVIOUSLY CLAIMED - should return null if no tier', async () => {
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
