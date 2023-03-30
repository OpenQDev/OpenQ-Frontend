import { getTierWinnerTransactions } from '../../lib/batchUtils';
import tierWinnerJSON from './json/tierWinner.json';
import tierWinnerBatchTxnArray from './json/tierWinnerBatchTxnArray.json';

describe('Batch Mint - Tier Winner', () => {
  const loadGithubData = async () => {
    return { bountyId: 'bountyId' };
  };

  const loadGithubDataUser = async (userId, tier) => {
    return `USER-${tier}`;
  };

  const loadOnChainBounty = async () => {
    return {
      bountyAddress: '0xbc14a8773a9ebffb8cb275765f34666c33c358b2',
      id: '0xbc14a8773a9ebffb8cb275765f34666c33c358b2',
      bountyId: 'I_kwDOI-Vpys5fTA1o',
      closerData: null,
      bountyMintTime: '1679415624',
      bountyClosedTime: null,
      claimedTransactionHash: null,
      payoutSchedule: [
        '375000000',
        '375000000',
        '375000000',
        '375000000',
        '750000000',
        '750000000',
        '750000000',
        '750000000',
        '833330000',
        '833330000',
        '833330000',
      ],
      tierWinners: null,
      payoutTokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      status: '0',
      bountyType: '3',
      deposits: [],
      bountyTokenBalances: [],
      issuer: {
        id: '0xbcb0a2d4e644f294849d7792f2a077f9349b155f',
      },
    };
  };

  const getToken = async () => {
    return { decimals: 6 };
  };

  it('should return correct transactions', async () => {
    let transactions = [];
    try {
      transactions = await getTierWinnerTransactions(
        tierWinnerJSON,
        '0xOPENQ',
        loadGithubData,
        loadGithubDataUser,
        loadOnChainBounty,
        { getToken }
      );
    } catch (error) {
      console.log(error);
      expect(1).toEqual(0);
    }

    expect(transactions).toEqual(tierWinnerBatchTxnArray);
  });
});
