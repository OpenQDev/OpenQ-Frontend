import { convertPayoutScheduleToBigInt } from '../../../lib/batchUtils';

describe('Batch Mint', () => {
  it('should pass', async () => {
    const payoutScheduleString = '[375.0, 375.0, 375.0, 375.0, 750.0, 750.0, 750.0, 750.0, 833.33, 833.33, 833.33]';

    const convertedToBigInt = convertPayoutScheduleToBigInt(payoutScheduleString, 6);

    expect(convertedToBigInt.toString()).toEqual(
      '375000000,375000000,375000000,375000000,750000000,750000000,750000000,750000000,833330000,833330000,833330000'
    );
  });
});
