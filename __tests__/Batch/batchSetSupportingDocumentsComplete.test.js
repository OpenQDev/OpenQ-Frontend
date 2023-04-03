import { getSetSupportingDocumentsCompleteTransactions } from '../../lib/batchUtils';
import supportingDocsJSON from './json/supportingDocs.json';

import SupportingDocsBatchTxnArray from './json/SupportingDocsBatchTxnArray.json';

describe('Batch Mint - Supporting Documents Complete', () => {
  const loadGithubData = async () => {
    return { bountyId: 'bountyId' };
  };

  const loadGithubDataUser = async (githubUserUrl) => {
		if (githubUserUrl == 'https://github.com/FlacoJones') {
			return 'USER_1';
		} else {
			return 'USER_2';
		}
  };

  const loadOnChainBounty = async () => {
    return {
      tierWinners: ['USER_1', 'USER_2']
    };
  };

  const getToken = async () => {
    return { decimals: 6 };
  };

  it.only('should return correct transactions', async () => {
    let transactions = [];
    try {
      transactions = await getSetSupportingDocumentsCompleteTransactions(
        supportingDocsJSON,
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

    expect(transactions).toEqual(SupportingDocsBatchTxnArray);
  });
});
