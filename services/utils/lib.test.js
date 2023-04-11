import {
  checkHackathonDates,
  getNonBlacklisted,
  shortenAddress,
  parseVolume,
  listWordsWithAnd,
  capitalize,
  getBigNumberVol,
  checkFixedAndSplit,
  checkTiered,
  getWinningPrOfUser,
  getBountyMarker,
  getPlural,
  getBool,
  reverseBool,
  getW8Approved,
  isEveryValueNotNull,
  formatVolume,
  fetchRequestsWithServiceArg,
} from './lib';
import Constants from '../../test-utils/constant';

describe('getNonBlacklisted', () => {
  it('should return an  of non-blacklisted repos', async () => {
    const repoName = Constants.repoName;
    const getPrs = vi.fn().mockReturnValue({ repoPrs: [{ id: 'a' }, { id: 'b' }], totalCount: 0 });
    const getSubmissions = vi.fn().mockReturnValue([{ id: 'a', blacklisted: true }]);
    const githubRepository = { getPrs };
    const openQPrismaClient = { getSubmissions };
    const mockAppState = { githubRepository, openQPrismaClient };
    const org = Constants.orgName;
    const limit = Constants.limit;
    const value = await getNonBlacklisted(mockAppState, repoName, org, limit);
    expect(value).toEqual({ nonBlacklisted: [{ id: 'b' }], totalCount: 0 });
  });
});
describe('shortenAddress', () => {
  it('return empty string if undefined', async () => {
    expect(shortenAddress(undefined)).toEqual('');
  });
  it('return shortened address if not null', async () => {
    expect(shortenAddress('0x1234567890123456789012345678901234567890')).toEqual('0x12...7890');
  });
});
describe('parseVolume', () => {
  it('should return null if input is not a number', () => {
    expect(parseVolume('a')).toBe(null);
  });
  it('should return null if input is not a number', () => {
    expect(parseVolume('aasdfasdf234rf.234')).toBe(null);
  });
  it('should return number if input is mixed', () => {
    expect(parseVolume('12.0123')).toBe('12.0123');
  });
  it('should return number if input is mixed', () => {
    expect(parseVolume('.0123')).toBe('.0123');
  });
});
describe('listWordsWithAnd', () => {
  it('should return empty string if empty ', () => {
    expect(listWordsWithAnd([])).toBe('');
  });
  it('should return empty string if empty ', () => {
    expect(listWordsWithAnd(['a'])).toBe('a');
  });
  it('should return empty string if empty ', () => {
    expect(listWordsWithAnd(['a', 'b'])).toBe('a and b');
  });
  it('should return empty string if empty ', () => {
    expect(listWordsWithAnd(['a', 'b', 'c'])).toBe('a, b, and c');
  });
});
describe('capitalize', () => {
  it('should return empty string if undefined', () => {
    expect(capitalize(undefined)).toEqual('');
  });
  it('should return empty string if null', () => {
    expect(capitalize(null)).toEqual('');
  });
  it('should return capitalized string', () => {
    expect(capitalize('hello')).toEqual('Hello');
  });
  it('should return capitalized string', () => {
    expect(capitalize('Hello')).toEqual('Hello');
  });
});

describe('getBigNumberVol', () => {
  it('should return 1', () => {
    const volume = '1';
    const token = {
      decimals: 18,
    };
    const result = getBigNumberVol(volume, token);
    expect(result.toLocaleString('fullwide', { useGrouping: false })).toBe('1000000000000000000');
  });
  it('should return 1', () => {
    const volume = '1';
    const decimal6 = { decimals: 6 };
    const result = getBigNumberVol(volume, decimal6);
    expect(result.toLocaleString('fullwide', { useGrouping: false })).toBe('1000000');
  });
  it('should return 0 when given .', () => {
    const volume = '.';
    const token = {
      decimals: 18,
    };
    const result = getBigNumberVol(volume, token);
    expect(result.toLocaleString('fullwide', { useGrouping: false })).toBe('0');
  });
});
describe('checkHackathonDates', () => {
  const today = new Date('01-01-2023');
  it('should be able to register without defining dates', () => {
    const result = checkHackathonDates(undefined, undefined, today);
    expect(result).toBe(true);
  });
  it('should return true when Start Date < End Date and both dates are in the future', () => {
    const result = checkHackathonDates('02-02-2023', '12-12-2023', today);
    expect(result).toBe(true);
  });
  it('should return false when Start Date > End Date', () => {
    const result = checkHackathonDates('12-12-2023', '02-02-2023', today);
    expect(result).toBe(false);
  });
  it('should return false when Start Date < today', () => {
    const result = checkHackathonDates('12-12-2022', '02-02-2023', today);
    expect(result).toBe(false);
  });
  it('should return true when Start Date > today & End date not defined yet', () => {
    const result = checkHackathonDates('12-12-2023', undefined, today);
    expect(result).toBe(true);
  });
  it('should return true when End Date > today & Start date not defined yet', () => {
    const result = checkHackathonDates(undefined, '12-12-2023', today);
    expect(result).toBe(true);
  });
  it('should return false when Start Date < today & End date not defined yet', () => {
    const result = checkHackathonDates('12-12-2022', undefined, today);
    expect(result).toBe(false);
  });
  it('should return false when End Date < today & Start date not defined yet', () => {
    const result = checkHackathonDates(undefined, '12-12-2022', today);
    expect(result).toBe(false);
  });
});

describe('checkFixedAndSplit', () => {
  it('should return true when both fixed and split are not defined', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      status: '0',
      claims: [{ claimantAsset: 'claimantAsset' }],
      prs: [{ source: { url: 'claimantAsset', merged: true, author: { id: currentUser } } }],
    };
    const result = checkFixedAndSplit(bounty, currentUser);
    expect(result).toEqual({ status: 'Claimed' });
  });
  it('should return true when both fixed and split are not defined', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      status: '0',
      claims: [{ claimantAsset: 'claimaasdfntAsset' }],
      prs: [{ source: { url: 'claimantasdAsset', merged: true, author: { id: currentUser } } }],
    };
    const result = checkFixedAndSplit(bounty, currentUser);
    expect(result).toEqual({ status: 'Claimable' });
  });
  it('should return true when both fixed and split are not defined', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      tierWinners: [currentUser],
      claims: [{ tier: '0', claimantAsset: 'claimantAsset' }],
    };

    const result = checkTiered(bounty, currentUser);
    expect(result).toEqual({ status: 'Claimed' });
  });
  it('should return true when both fixed and split are not defined', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      tierWinners: [currentUser],
      claims: [{ tier: '1', claimantAsset: 'claimantAsset' }],
    };

    const result = checkTiered(bounty, currentUser);
    expect(result).toEqual({ status: 'Claimable' });
  });
});

describe('getWinningPrOfUser', () => {
  it('should return pr', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      tierWinners: [currentUser],
      claims: [{ tier: '0', claimantAsset: 'claimantAsset' }],
    };
    const result = getWinningPrOfUser(bounty, currentUser);
    expect(result).toEqual(Constants.pr);
  });
  it('should return pr', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
    };
    const result = getWinningPrOfUser(bounty, currentUser);
    expect(result).toEqual(undefined);
  });
});

describe('getBountyMarker', () => {
  const statusFunc = () => {
    return {};
  };

  it('return closed if closed', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      closed: true,
    };

    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({ colour: 'bg-danger', fill: 'fill-danger', status: 'Closed' });
  });
  it('return claim available if available', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      closed: false,
    };

    const statusFunc = () => {
      return { status: 'Claimable' };
    };
    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({ colour: 'bg-closed', fill: 'fill-closed', status: 'Claim Available' });
  });
  it('return claimed', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty0,
      closed: false,
    };

    const statusFunc = () => {
      return { status: 'Claimed' };
    };
    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({ colour: 'bg-closed', fill: 'fill-closed', status: 'Claimed' });
  });
  it('return in progress', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty,
      closed: false,
      assignees: [{}],
    };

    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({
      colour: 'bg-yellow-500 text-black fill-black',
      fill: 'fill-yellow-500',
      status: 'In Progress',
    });
  });
  it('return in ready for work', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty,
      closed: false,
      assignees: [],
    };

    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({
      colour: 'bg-green',
      fill: 'fill-green',
      status: 'Ready for Work',
    });
  });
  it('return in open', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty2,
      closed: false,
      assignees: [],
    };

    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({
      colour: 'bg-green',
      fill: 'fill-green',
      status: 'Open',
    });
  });
  it('return in closed on chain', () => {
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty2,
      closed: false,
      assignees: [],
      status: '1',
    };

    const value = getBountyMarker(bounty, {}, currentUser, statusFunc);
    expect(value).toEqual({ status: 'Closed', colour: 'bg-danger', fill: 'fill-danger' });
  });
});
describe('getPlural', () => {
  it('return plural', () => {
    const value = getPlural(2);
    expect(value).toEqual('s');
  });
  it('return singular', () => {
    const value = getPlural(1);
    expect(value).toEqual('');
  });
});

describe('reverseBool', () => {
  it('should return true when value is true', () => {
    const result = reverseBool(true);
    expect(result).toBe('Yes');
  });
  it('should return false when value is false', () => {
    const result = reverseBool(false);
    expect(result).toBe('No');
  });
});
describe('getBool', () => {
  it('should return true when value is true', () => {
    const result = getBool('Yes');
    expect(result).toBe(true);
  });
  it('should return false when value is false', () => {
    const result = getBool('No');
    expect(result).toBe(false);
  });
});
describe('getW8Approved', () => {
  it('should return true when value is true', () => {
    const user = Constants.accountData;
    const bounty = Constants.bounty;
    const result = getW8Approved(bounty, user);
    expect(result).toBe(undefined);
  });
  it('should return false when value is true fixed', () => {
    const user = Constants.accountData;
    const bounty = { ...Constants.bounty, bountyType: '0', supportingDocumentsCompleted: true };
    const result = getW8Approved(bounty, user);
    expect(result).toBe(true);
  });
  it('should return false when value is true contest', () => {
    const user = Constants.accountData;
    const bounty = {
      ...Constants.bounty,
      bountyType: '3',
      supportingDocumentsCompleted: [user.github],
      tierWinners: [user.github],
    };
    const result = getW8Approved(bounty, user);
    expect(result).toBe(user.github);
  });
});
describe('isEveryValueTrue', () => {
  it('should return true when value is true', () => {
    const valueObj = {
      kyc: true,
      w8Form: true,
      githubHasWallet: true,
      invoice: true,
    };
    const result = isEveryValueNotNull(valueObj);
    expect(result).toBe(true);
  });
  it('should return false when value is false', () => {
    const valueObj = {
      kyc: false,
      w8Form: false,
      githubHasWallet: true,
      invoice: false,
    };
    const result = isEveryValueNotNull(valueObj);
    expect(result).toBe(false);
  });
});
describe('formatVolume', () => {
  it('should return 0 when value is 0', () => {
    const value = 0;
    const token = { decimals: 0 };
    const result = formatVolume(value, token);
    expect(result).toBe('0.0');
  });
  it('should return 0 when value is 0', () => {
    const value = '1000000000000000000';
    const token = { decimals: 0 };
    const result = formatVolume(value, token);
    expect(result).toBe('1.0');
  });
});
describe('fetchRequestsWithServiceArg', () => {
  it('should return an  of requests', async () => {
    const batch = 10;
    const bountyWithRequest = {
      ...Constants.bounty0,
      requests: {
        nodes: [Constants.request0, Constants.request1],
      },
    };
    const getUserRequests = vi.fn().mockReturnValueOnce({
      createdBounties: { bountyConnection: { nodes: [bountyWithRequest, bountyWithRequest] } },
    });
    const fetchUserById = vi.fn().mockReturnValueOnce({
      user: {
        github: 'test',
        id: '0x123',
      },
    });
    const appState = {
      openQPrismaClient: {
        getUserRequests,
      },
      githubRepository: {
        fetchUserById,
      },
    };
    const identity = {
      github: 'test',
      id: '0x123',
    };
    const oldCursor = '0x123';
    const result = await fetchRequestsWithServiceArg(appState, identity, oldCursor, batch);
    expect(result).toEqual({
      complete: true,
      cursor: undefined,
      nodes: [
        {
          bounty: {
            address: '0x066efd87027a4cc4a21c57467f224ef98241d774',
            assignees: [],
            avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
            body: 'body of test2',
            bodyHTML: '<p dir="auto">body of test2</p>',
            bountyAddress: '0x066efd87027a4cc4a21c57467f224ef98241d774',
            bountyId: 'I_kwDOGWnnz85I9Agl',
            bountyMintTime: '1661785920',
            bountyTokenBalances: [
              {
                __typename: 'BountyFundedTokenBalance',
                tokenAddress: '0x0000000000000000000000000000000000000000',
                volume: '2000000000000000000',
              },
              {
                __typename: 'BountyFundedTokenBalance',
                tokenAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
                volume: '2000000000000000000',
              },
              {
                __typename: 'BountyFundedTokenBalance',
                tokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
                volume: '2000000000000000000',
              },
            ],
            bountyType: '0',
            claims: [],
            closed: true,
            closedAt: '2022-03-28T17:57:44Z',
            closedEvents: [
              {
                __typename: 'ClosedEvent',
                actor: {
                  __typename: 'User',
                  avatarUrl:
                    'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
                  login: 'FlacoJones',
                  name: null,
                  url: 'https://github.com/FlacoJones',
                },
                id: 'CE_lADOGWnnz85GjwA1zwAAAAF4vHFc',
              },
            ],
            closerData: null,
            createdAt: '1661767948472',
            deposits: [
              {
                __typename: 'Deposit',
                expiration: '0',
                id: '0xe5551a3fa87d93a0c6c084d572b9e282114befc43dc68f08be6d53d13830e356',
                receiveTime: '1661785920',
                refundTime: null,
                refunded: false,
                sender: {
                  __typename: 'User',
                  id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
                },
                tokenAddress: '0x0000000000000000000000000000000000000000',
                volume: '1000000000000000000',
              },
              {
                __typename: 'Deposit',
                expiration: '0',
                id: '0xb4f31aab8a1c4bfe26236729e8cd8e4abf81d63283e006b4ec677a7ce6b2871a',
                receiveTime: '1661785920',
                refundTime: '1661785920',
                refunded: true,
                sender: {
                  __typename: 'User',
                  id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
                },
                tokenAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
                volume: '2000000000000000000',
              },
              {
                __typename: 'Deposit',
                expiration: '0',
                id: '0x7db2691e573b9c19e90f391cd3eda9ce9246666a1502f2bf87b9d47d13679bc0',
                receiveTime: '1661785920',
                refundTime: null,
                refunded: false,
                sender: {
                  __typename: 'User',
                  id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
                },
                tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
                volume: '1000000000000000000',
              },
            ],
            fundingGoalTokenAddress: '0x0000000000000000000000000000000000000000',
            id: undefined,
            issuer: {
              __typename: 'User',
              id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
            },
            labels: [
              {
                __typename: 'Label',
                color: '0075ca',
                name: 'documentation',
              },
              {
                __typename: 'Label',
                color: 'cfd3d7',
                name: 'duplicate',
              },
            ],
            number: 8,
            owner: 'OpenQDev',
            prs: [
              {
                __typename: 'CrossReferencedEvent',
                assignees: [],
                id: 'CRE_kwDOGWnnz85GHUw1',
                referencedAt: '2022-03-28T17:47:26Z',
                source: {
                  __typename: 'PullRequest',
                  author: {
                    __typename: 'User',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
                    email: '',
                    id: 'U_kgDOBZIDuA',
                    login: 'FlacoJones',
                    url: 'https://github.com/FlacoJones',
                    user: {
                      __typename: 'User',
                      login: 'FlacoJones',
                      url: 'https://github.com/FlacoJones',
                    },
                  },
                  body: 'This Closes #136 and also unrelated thing of Fixes #137',
                  bodyHTML:
                    '<p dir="auto">This <span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #136.">Closes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="1183776821" data-permission-text="Title is private" data-url="https://github.com/OpenQDev/OpenQ-TestRepo/issues/136" data-hovercard-type="issue" data-hovercard-url="/OpenQDev/OpenQ-TestRepo/issues/136/hovercard" href="https://github.com/OpenQDev/OpenQ-TestRepo/issues/136">#136</a> and also unrelated thing of <span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #137.">Fixes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="1183777365" data-permission-text="Title is private" data-url="https://github.com/OpenQDev/OpenQ-TestRepo/issues/137" data-hovercard-type="issue" data-hovercard-url="/OpenQDev/OpenQ-TestRepo/issues/137/hovercard" href="https://github.com/OpenQDev/OpenQ-TestRepo/issues/137">#137</a></p>',
                  bodyText: 'This Closes #136 and also unrelated thing of Fixes #137',
                  id: 'PR_kwDOGWnnz841LGsK',
                  mergeCommit: {
                    __typename: 'Commit',
                    author: {
                      __typename: 'GitActor',
                      avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?v=4',
                      name: 'FlacoJones',
                      user: {
                        __typename: 'User',
                        login: 'FlacoJones',
                        url: 'https://github.com/FlacoJones',
                      },
                    },
                  },
                  merged: true,
                  mergedAt: '2022-03-28T17:57:44Z',
                  createdAt: '2022-03-28T17:57:44Z',
                  title: 'Update README.md',
                  url: 'https://github.com/OpenQDev/OpenQ-TestRepo/pull/138',
                },
              },
            ],
            refunds: [
              {
                __typename: 'Refund',
                depositId: '0xb4f31aab8a1c4bfe26236729e8cd8e4abf81d63283e006b4ec677a7ce6b2871a',
                refundTime: '1661795920',
                tokenAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
                volume: '2000000000000000000',
              },
            ],
            repoName: 'OpenQ-Frontend',
            requests: {
              nodes: [
                {
                  requestingUser: {
                    email: 'abc123@gmail.com',
                    username: 'Christopher',
                    watchedBounties: undefined,
                  },
                },
                {
                  requestingUser: {
                    email: 'abc123@gmail.com',
                    username: 'Christopher',
                    watchedBounties: undefined,
                  },
                },
              ],
            },
            title: 'Properly Referenced and Merged by FlacoJones',
            titleHTML: 'Properly Referenced and Merged by FlacoJones',
            tvl: '9.51848',
            twitterUsername: 'openqlabs',
            url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/8',
          },
          request: {
            requestingUser: {
              email: 'abc123@gmail.com',
              githubUser: {
                user: {
                  github: 'test',
                  id: '0x123',
                },
              },
              username: 'Christopher',
              watchedBounties: undefined,
            },
          },
        },
      ],
    });
  });
});
