import { BigNumber } from 'ethers';

export default class Constants {
  constructor() {}
  static get githubUserId() {
    return 'MDQ6VXNlcjcyMTU2Njc5';
  }

  static get uuid() {
    return '63a3a266ab24d99d359a6d51';
  }
  static get bountyCost() {
    return '$9.52';
  }
  static get pr() {
    return {
      __typename: 'PullRequest',
      author: {
        __typename: 'User',
        avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
        email: '',
        id: 'U_kgDOBZIDuA',
        login: 'FlacoJones',
        url: 'https://github.com/FlacoJones',
        user: { __typename: 'User', login: 'FlacoJones', url: 'https://github.com/FlacoJones' },
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
          user: { __typename: 'User', login: 'FlacoJones', url: 'https://github.com/FlacoJones' },
        },
      },
      merged: true,
      mergedAt: '2022-03-28T17:57:44Z',
      createdAt: '2022-03-28T17:57:44Z',
      title: 'Update README.md',
      url: 'https://github.com/OpenQDev/OpenQ-TestRepo/pull/138',
    };
  }

  static get modalPayout() {
    return {
      transaction: {
        to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
        from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        contractAddress: null,
        transactionIndex: 0,
        gasUsed: {
          type: 'BigNumber',
          hex: '0x013cde',
        },
        logsBloom:
          '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
        blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
        logs: [
          {
            transactionIndex: 0,
            blockNumber: 92,
            transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
            address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
            data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
            logIndex: 0,
            blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          },
        ],
        blockNumber: 92,
        confirmations: 1,
        cumulativeGasUsed: {
          type: 'BigNumber',
          hex: '0x013cde',
        },
        effectiveGasPrice: {
          type: 'BigNumber',
          hex: '0x01668feb11',
        },
        status: 1,
        type: 2,
        byzantium: true,
        events: [
          {
            transactionIndex: 0,
            blockNumber: 92,
            transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
            address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
            data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
            logIndex: 0,
            blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
            args: [
              '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
              '0x0000000000000000000000000000000000000000',
              BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
              {
                type: 'BigNumber',
                hex: '0x03',
              },
              '0x',
              {
                type: 'BigNumber',
                hex: '0x01',
              },
            ],
            event: 'FundingGoalSet',
            eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
          },
        ],
      },
      type: 'Payout',
    };
  }
  static get modalBudget() {
    return {
      transaction: {
        to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
        from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        contractAddress: null,
        transactionIndex: 0,
        gasUsed: {
          type: 'BigNumber',
          hex: '0x013cde',
        },
        logsBloom:
          '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
        blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
        logs: [
          {
            transactionIndex: 0,
            blockNumber: 92,
            transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
            address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
            data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
            logIndex: 0,
            blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          },
        ],
        blockNumber: 92,
        confirmations: 1,
        cumulativeGasUsed: {
          type: 'BigNumber',
          hex: '0x013cde',
        },
        effectiveGasPrice: {
          type: 'BigNumber',
          hex: '0x01668feb11',
        },
        status: 1,
        type: 2,
        byzantium: true,
        events: [
          {
            transactionIndex: 0,
            blockNumber: 92,
            transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
            address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
            data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
            logIndex: 0,
            blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
            args: [
              '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
              '0x0000000000000000000000000000000000000000',
              BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
              {
                type: 'BigNumber',
                hex: '0x03',
              },
              '0x',
              {
                type: 'BigNumber',
                hex: '0x01',
              },
            ],
            event: 'FundingGoalSet',
            eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
          },
        ],
      },
      type: 'Budget',
    };
  }
  static get token_id() {
    return '1';
  }
  static get nft() {
    return { token_address: Constants.daiAddress, token_id: Constants.token_id };
  }
  static get roles() {
    return [Constants.role0, Constants.role1];
  }
  static get role0() {
    return 'engineer';
  }
  static get role1() {
    return 'manager';
  }

  static get modalClosedSplitPrice() {
    return {
      transaction: {
        to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
        from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        contractAddress: null,
        transactionIndex: 0,
        gasUsed: {
          type: 'BigNumber',
          hex: '0x013cde',
        },
        logsBloom:
          '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
        blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
        logs: [
          {
            transactionIndex: 0,
            blockNumber: 92,
            transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
            address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
            data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
            logIndex: 0,
            blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          },
        ],
        blockNumber: 92,
        confirmations: 1,
        cumulativeGasUsed: {
          type: 'BigNumber',
          hex: '0x013cde',
        },
        effectiveGasPrice: {
          type: 'BigNumber',
          hex: '0x01668feb11',
        },
        status: 1,
        type: 2,
        byzantium: true,
        events: [
          {
            transactionIndex: 0,
            blockNumber: 92,
            transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
            address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
            data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
            logIndex: 0,
            blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
            args: [
              '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
              '0x0000000000000000000000000000000000000000',
              BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
              {
                type: 'BigNumber',
                hex: '0x03',
              },
              '0x',
              {
                type: 'BigNumber',
                hex: '0x01',
              },
            ],
            event: 'FundingGoalSet',
            eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
          },
        ],
      },
      type: 'Closed Split Price',
    };
  }
  static get modalClosedContest() {
    return {
      transaction: {
        to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
        from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        contractAddress: null,
        transactionIndex: 0,
        gasUsed: {
          type: 'BigNumber',
          hex: '0x013cde',
        },
        logsBloom:
          '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
        blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
        logs: [
          {
            transactionIndex: 0,
            blockNumber: 92,
            transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
            address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
            data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
            logIndex: 0,
            blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          },
        ],
        blockNumber: 92,
        confirmations: 1,
        cumulativeGasUsed: {
          type: 'BigNumber',
          hex: '0x013cde',
        },
        effectiveGasPrice: {
          type: 'BigNumber',
          hex: '0x01668feb11',
        },
        status: 1,
        type: 2,
        byzantium: true,
        events: [
          {
            transactionIndex: 0,
            blockNumber: 92,
            transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
            address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
            data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
            logIndex: 0,
            blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
            args: [
              '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
              '0x0000000000000000000000000000000000000000',
              BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
              {
                type: 'BigNumber',
                hex: '0x03',
              },
              '0x',
              {
                type: 'BigNumber',
                hex: '0x01',
              },
            ],
            event: 'FundingGoalSet',
            eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
          },
        ],
      },
      type: 'PayoutSchedule',
      finalTierVolume: [70, 20, 10],
    };
  }

  static get email() {
    return 'abc123@gmail.com';
  }

  static get userName() {
    return 'Christopher';
  }
  static getTwitter() {
    return 'https://twitter.com/Christo28120856';
  }
  static getWatchedBounties() {
    return { __typename: 'Bounties', nodes: [] };
  }
  static getStarredOrganizationIds() {
    return [];
  }

  static get accountData() {
    return {
      id: Constants.uuid,
      github: Constants.githubUserId,
      email: Constants.email,
      username: Constants.userName,
      twitter: 'https://twitter.com/Christo28120856',

      watchedBounties: Constants.watchedBounties,
      starredOrganizationIds: Constants.starredOrganizationIds,
    };
  }

  static get bountyId() {
    return 'I_kwDOGWnnz85I9Agl';
  }
  static get claimant() {
    return { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' };
  }
  static get claimantAsset() {
    return 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/153';
  }
  static get claim() {
    return {
      claimTime: Constants.claimTime,
      claimant: Constants.claimant,
      claimantAsset: Constants.claimantAsset,
      __typename: 'Claim',
    };
  }
  static get claimTime() {
    return '1661767948472';
  }
  static get body() {
    return 'body of test2';
  }
  static get url() {
    return 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/8';
  }
  static get languages() {
    return [Constants.language1, Constants.language2, Constants.language3];
  }
  static get repoName() {
    return 'OpenQ-Frontend';
  }
  static get owner() {
    return 'OpenQDev';
  }
  static get avatarUrl() {
    return 'https://avatars.githubusercontent.com/u/77402538?v=4';
  }
  static get labels() {
    return [Constants.label1, Constants.label2];
  }
  static get createdAt() {
    return '1661767948472';
  }
  static get closed() {
    return true;
  }
  static get bodyHTML() {
    return '<p dir="auto">body of test2</p>';
  }
  static get title() {
    return 'Properly Referenced and Merged by FlacoJones';
  }
  static get titleHTML() {
    return 'Properly Referenced and Merged by FlacoJones';
  }
  static get tvl() {
    return '9.51848';
  }

  static get tvc() {
    return '7.7777';
  }

  static get assignees() {
    return [];
  }
  static get twitterUsername() {
    return 'openqlabs';
  }
  static get number() {
    return 8;
  }

  static get authState() {
    return {
      login: 'Christopher-Stevers',
    };
  }
  static get prs() {
    return [Constants.pr1];
  }
  static get zeroAddress() {
    return '0x0000000000000000000000000000000000000000';
  }

  static getTokenName() {
    return 'Dai Stablecoin';
  }
  static get tokenSymbol() {
    return 'DAI';
  }
  static get tokenDecimals() {
    return 18;
  }
  static get tokenLogoURI() {
    return 'https://tokens.1inch.exchange/0x6b175474e89094c44da98b954eedeac495271d0f.png';
  }
  static get tokenMetadata() {
    return {
      __typename: 'TokenMetadata',
      id: Constants.zeroAddress,
      name: Constants.tokenName,
      symbol: Constants.tokenSymbol,
      decimals: Constants.tokenDecimals,
      logoURI: Constants.tokenLogoURI,
    };
  }
  static get pr1() {
    return {
      __typename: 'CrossReferencedEvent',
      id: 'CRE_kwDOGWnnz85GHUw1',
      assignees: Constants.assignees,
      referencedAt: '2022-03-28T17:47:26Z',
      source: {
        __typename: 'PullRequest',
        mergedAt: '2022-03-28T17:57:44Z',
        createdAt: '2022-03-28T17:57:44Z',
        url: 'https://github.com/OpenQDev/OpenQ-TestRepo/pull/138',
        id: 'PR_kwDOGWnnz841LGsK',
        merged: true,
        bodyText: 'This Closes #136 and also unrelated thing of Fixes #137',
        body: 'This Closes #136 and also unrelated thing of Fixes #137',
        bodyHTML:
          '<p dir="auto">This <span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #136.">Closes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="1183776821" data-permission-text="Title is private" data-url="https://github.com/OpenQDev/OpenQ-TestRepo/issues/136" data-hovercard-type="issue" data-hovercard-url="/OpenQDev/OpenQ-TestRepo/issues/136/hovercard" href="https://github.com/OpenQDev/OpenQ-TestRepo/issues/136">#136</a> and also unrelated thing of <span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #137.">Fixes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="1183777365" data-permission-text="Title is private" data-url="https://github.com/OpenQDev/OpenQ-TestRepo/issues/137" data-hovercard-type="issue" data-hovercard-url="/OpenQDev/OpenQ-TestRepo/issues/137/hovercard" href="https://github.com/OpenQDev/OpenQ-TestRepo/issues/137">#137</a></p>',
        title: 'Update README.md',
        author: {
          __typename: 'User',
          login: 'FlacoJones',
          user: { __typename: 'User', login: 'FlacoJones', url: 'https://github.com/FlacoJones' },

          avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
          url: 'https://github.com/FlacoJones',
          id: 'U_kgDOBZIDuA',
          email: '',
        },
        mergeCommit: {
          __typename: 'Commit',
          author: {
            __typename: 'GitActor',
            avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?v=4',
            name: 'FlacoJones',
            user: { __typename: 'User', login: 'FlacoJones', url: 'https://github.com/FlacoJones' },
          },
        },
      },
    };
  }

  static get closedEvents() {
    return [Constants.closedEvent1];
  }
  static get closedAt() {
    return '2022-03-28T17:57:44Z';
  }
  static get language1() {
    return {
      __typename: 'Language',
      name: 'JavaScript',
      color: '#f1e05a',
    };
  }
  static get language2() {
    return {
      __typename: 'Language',
      name: 'CSS',
      color: '#563d7c',
    };
  }
  static get language3() {
    return {
      __typename: 'Language',
      name: 'Dockerfile',
      color: '#384d54',
    };
  }
  static get language4() {
    return {
      __typename: 'Language',
      name: 'Shell',
      color: '#89e051',
    };
  }
  static get label1() {
    return {
      __typename: 'Label',
      name: 'documentation',
      color: '0075ca',
    };
  }
  static get label2() {
    return {
      __typename: 'Label',
      name: 'duplicate',
      color: 'cfd3d7',
    };
  }
  static get label3() {
    return {
      __typename: 'Label',
      name: 'enhancement',
      color: 'a2eeef',
    };
  }

  static get label4() {
    return {
      __typename: 'Label',
      name: 'javascript',
      color: 'E16391',
    };
  }
  static get label5() {
    return {
      __typename: 'Label',
      name: 'bounty',
      color: '727384',
    };
  }
  static get repoUrl() {
    return 'https://github.com/OpenQDev/OpenQ-Frontend';
  }
  static get repoDescription() {
    return null;
  }
  static get closedEvent1() {
    return {
      __typename: 'ClosedEvent',
      id: 'CE_lADOGWnnz85GjwA1zwAAAAF4vHFc',
      actor: {
        __typename: 'User',
        avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
        login: 'FlacoJones',
        url: 'https://github.com/FlacoJones',
        name: null,
      },
    };
  }

  static get bountyAddress() {
    return '0x066efd87027a4cc4a21c57467f224ef98241d774';
  }
  static get bountyMintTime() {
    return '1661785920';
  }
  static get bountyClosedTime() {
    return null;
  }
  static get status() {
    return '0';
  }
  static get fundingGoalTokenAddress() {
    return '0x0000000000000000000000000000000000000000';
  }
  static get fundingGoalVolume() {
    return '0';
  }
  static get payoutTokenVolume() {
    return '100';
  }
  static get payoutTokenAddress() {
    return '0x5fbdb2315678afecb367f032d93f642f64180aa3';
  }
  static get payoutSchedule0() {
    return null;
  }
  static get payoutSchedule2() {
    return ['30', '60', '10'];
  }
  static get payoutSchedule3() {
    return ['30000000000000000000', '60000000000000000000', '10000000000000000000'];
  }
  static get closerData() {
    return null;
  }
  static get bountyType0() {
    return 0;
  }
  static get bountyType1() {
    return 1;
  }
  static get bountyType2() {
    return 2;
  }
  static get bountyType3() {
    return 3;
  }
  static get claimedTransactionHash() {
    return null;
  }
  static get deposits() {
    return [Constants.deposit1, Constants.deposit2, Constants.deposit3];
  }

  static get deposit1() {
    return {
      id: '0xe5551a3fa87d93a0c6c084d572b9e282114befc43dc68f08be6d53d13830e356',
      refunded: false,
      receiveTime: '1661785920',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      expiration: '0',
      volume: '1000000000000000000',
      refundTime: null,
      sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
      __typename: 'Deposit',
    };
  }
  static get deposit2() {
    return {
      id: '0xb4f31aab8a1c4bfe26236729e8cd8e4abf81d63283e006b4ec677a7ce6b2871a',
      refunded: true,
      receiveTime: '1661785920',
      tokenAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      expiration: '0',
      volume: '2000000000000000000',
      refundTime: '1661785920',
      sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
      __typename: 'Deposit',
    };
  }
  static get deposit3() {
    return {
      id: '0x7db2691e573b9c19e90f391cd3eda9ce9246666a1502f2bf87b9d47d13679bc0',
      refunded: false,
      receiveTime: '1661785920',
      tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
      expiration: '0',
      volume: '1000000000000000000',
      refundTime: null,
      sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
      __typename: 'Deposit',
    };
  }
  static get deposit4() {
    return {
      id: '0xe5551a3fa87d93a0c6c084d572b9e282114befc43dc68f08be6d53d13830e001',
      refunded: true,
      receiveTime: '1661785920',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      expiration: '30',
      volume: '2000000000000000000',
      refundTime: null,
      sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
      __typename: 'Deposit',
    };
  }
  static get deposit5() {
    return {
      id: '0xe5551a3fa87d93a0c6c084d572b9e282114befc43dc68f08be6d53d13830e000',
      refunded: false,
      receiveTime: '1661785920',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      expiration: '1296000',
      volume: '3000000000000000000',
      refundTime: null,
      sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
      __typename: 'Deposit',
    };
  }
  static get payouts() {
    return [Constants.payout1, Constants.payout2, Constants.payout3];
  }

  static get payout1() {
    return {
      tokenAddress: Constants.maticAddress,
      volume: '700000000000000000000',
      closer: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
      __typename: 'Payout',
    };
  }

  static get payout2() {
    return {
      tokenAddress: Constants.linkAddress,
      volume: '300000000000000000000',
      payoutTime: '1663576393',
      closer: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
      __typename: 'Payout',
    };
  }

  static get payout3() {
    return {
      tokenAddress: Constants.daiAddress,
      volume: Constants.volume,
      payoutTime: '1663576393',
      closer: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
      __typename: 'Payout',
    };
  }
  static get refunds() {
    return [Constants.refund1];
  }
  static get refund1() {
    return {
      refundTime: '1661785920',
      tokenAddress: Constants.daiAddress,
      volume: Constants.volume,
      depositId: '0xb4f31aab8a1c4bfe26236729e8cd8e4abf81d63283e006b4ec677a7ce6b2871a',
      __typename: 'Refund',
    };
  }

  static get issuer() {
    return {
      __typename: 'User',
      id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    };
  }
  static get bountyTokenBalances() {
    return [Constants.bountyTokenBalanceMatic, Constants.bountyTokenBalanceDai, Constants.bountyTokenBalanceLink];
  }
  static get volume() {
    return '2000000000000000000';
  }
  static get bountyTokenBalanceMatic() {
    return {
      __typename: 'BountyFundedTokenBalance',
      volume: Constants.volume,
      tokenAddress: Constants.maticAddress,
    };
  }
  static get bountyTokenBalanceDai() {
    return {
      __typename: 'BountyFundedTokenBalance',
      volume: Constants.volume,
      tokenAddress: Constants.daiAddress,
    };
  }
  static get bountyTokenBalanceLink() {
    return {
      __typename: 'BountyFundedTokenBalance',
      volume: Constants.volume,
      tokenAddress: Constants.linkAddress,
    };
  }
  static get linkAddress() {
    return '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  }
  static get daiAddress() {
    return '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  }
  static get maticAddress() {
    return '0x0000000000000000000000000000000000000000';
  }
  static get address() {
    return '0x3c57cd59335d9a56b76feb48b3925d095e7e8e9f';
  }
  static get organizationId() {
    return '0x3c57cd59335d9a56b76feb48b3925d095e7e8e9f';
  }
  static get type() {
    return '1';
  }
  static get category() {
    return '1';
  }
  static get watchingCount() {
    return 0;
  }
  static get blacklisted() {
    return false;
  }
  static get organization() {
    return { blacklisted: false, __typename: 'Organization' };
  }
  static get bountyTypeFixed() {
    return '0';
  }
  static get fixedPrice() {
    return 'Fixed Price';
  }
  static get splitPrice() {
    return 'Split Price';
  }
  static get contestPrice() {
    return 'Contest';
  }
  static get fixedContestPrice() {
    return 'Fixed Contest';
  }
  static get readyForWork() {
    return 'Ready for Work';
  }
  static get inProgress() {
    return 'In Progress';
  }
  static get claimAvailable() {
    return 'Claim Available';
  }
  static get open() {
    return 'Open';
  }
  static get bountyTypeSplit() {
    return '1';
  }
  static get bountyTypeContest() {
    return '2';
  }
  static get bountyTypeFixedContest() {
    return '3';
  }
  static get bounty() {
    return {
      id: Constants.id,
      title: Constants.title,
      assignees: Constants.assignees,
      body: Constants.body,
      url: Constants.url,
      repoName: Constants.repoName,
      closedAt: Constants.closedAt,
      owner: Constants.owner,
      avatarUrl: Constants.avatarUrl,
      labels: Constants.labels,
      createdAt: Constants.createdAt,
      closed: Constants.closed,
      bodyHTML: Constants.bodyHTML,
      titleHTML: Constants.titleHTML,
      twitterUsername: Constants.twitterUsername,
      number: Constants.number,
      prs: Constants.prs,
      closedEvents: Constants.closedEvents,
      tvl: Constants.tvl,
      bountyId: Constants.bountyId,
      bountyAddress: Constants.bountyAddress,
      closerData: Constants.closerData,
      bountyMintTime: Constants.bountyMintTime,
      deposits: Constants.deposits,
      refunds: Constants.refunds,
      bountyTokenBalances: Constants.bountyTokenBalances,
      issuer: Constants.issuer,
      bountyType: Constants.bountyTypeFixed,
      fundingGoalTokenAddress: Constants.zeroAddress,
      claims: Constants.claims,
      address: Constants.bountyAddress,
    };
  }

  static get claims() {
    return [];
  }

  static get bountyClaimOverview() {
    return {
      id: 'I_kwDOGWnnz85Z_0oY',
      title: 'Checking no eligible prs',
      assignees: [],
      body: '',
      url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/792',
      repoName: 'OpenQ-TestRepo',
      closedAt: '2023-01-03T02:53:56Z',
      owner: 'OpenQDev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
      labels: [],
      createdAt: '2022-12-24T01:53:30Z',
      closed: true,
      bodyHTML: '',
      titleHTML: 'Checking no eligible prs',
      twitterUsername: 'openqlabs',
      number: 792,
      prs: [
        {
          __typename: 'CrossReferencedEvent',
          id: 'CRE_kwDOGWnnz85J73TY',
          referencedAt: '2022-12-24T01:57:04Z',
          source: {
            __typename: 'PullRequest',
            mergedAt: '2023-01-03T02:53:55Z',
            createdAt: '2022-03-28T17:57:44Z',
            url: 'https://github.com/OpenQDev/OpenQ-TestRepo/pull/793',
            id: 'PR_kwDOGWnnz85GJi_U',
            merged: true,
            bodyText: 'closes #792',
            body: 'closes #792 ',
            bodyHTML:
              '<p dir="auto"><span class="issue-keyword tooltipped tooltipped-se" aria-label="This pull request closes issue #792.">closes</span> <a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="1509902872" data-permission-text="Title is private" data-url="https://github.com/OpenQDev/OpenQ-TestRepo/issues/792" data-hovercard-type="issue" data-hovercard-url="/OpenQDev/OpenQ-TestRepo/issues/792/hovercard" href="https://github.com/OpenQDev/OpenQ-TestRepo/issues/792">#792</a></p>',
            title: 'Update README.md',
            author: {
              __typename: 'User',
              login: 'Christopher-Stevers',
              avatarUrl:
                'https://avatars.githubusercontent.com/u/72156679?u=7e821e3f2a1f88c0f4a134eec159189f9c3e7367&v=4',
              url: 'https://github.com/Christopher-Stevers',
              id: 'MDQ6VXNlcjcyMTU2Njc5',
              email: '',
            },
            mergeCommit: {
              __typename: 'Commit',
              author: {
                __typename: 'GitActor',
                avatarUrl: 'https://avatars.githubusercontent.com/u/72156679?v=4',
                name: 'Christopher Stevers',
                user: {
                  __typename: 'User',
                  login: 'Christopher-Stevers',
                  url: 'https://github.com/Christopher-Stevers',
                },
              },
            },
          },
        },
      ],
      repoId: 'R_kgDOGWnnzw',
      closedEvents: [
        {
          __typename: 'ClosedEvent',
          id: 'CE_lADOGWnnz85Z_0oYzwAAAAHlLAs1',
          actor: {
            __typename: 'User',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/72156679?u=7e821e3f2a1f88c0f4a134eec159189f9c3e7367&v=4',
            login: 'Christopher-Stevers',
            url: 'https://github.com/Christopher-Stevers',
            name: 'Christopher Stevers',
          },
        },
      ],
      bountyAddress: '0xbcc58fb72409ba1cdec5dbcdd3cd6c42e3e04242',
      bountyId: 'I_kwDOGWnnz85Z_0oY',
      closerData:
        '0x000000000000000000000000bcc58fb72409ba1cdec5dbcdd3cd6c42e3e042420000000000000000000000000000000000000000000000000000000000000080000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000144d44513656584e6c636a63794d5455324e6a6335000000000000000000000000000000000000000000000000000000000000000000000000000000000000003368747470733a2f2f6769746875622e636f6d2f4f70656e514465762f4f70656e512d546573745265706f2f70756c6c2f37393300000000000000000000000000',
      bountyMintTime: '1672714438',
      bountyClosedTime: '1672714503',
      fundingGoalVolume: '0',
      fundingGoalTokenAddress: '0x0000000000000000000000000000000000000000',
      payoutTokenVolume: null,
      payoutTokenAddress: null,
      payoutSchedule: null,
      invoiceable: false,
      claims: [
        {
          claimTime: '1672714503',
          claimantAsset: 'https://github.com/OpenQDev/OpenQ-TestRepo/pull/793',
          tier: '0',
          claimant: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
          __typename: 'Claim',
        },
      ],
      payouts: [
        {
          tokenAddress: '0x0000000000000000000000000000000000000000',
          volume: '12000000000000000000',
          payoutTime: '1672714503',
          closer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
          __typename: 'Payout',
        },
        {
          tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
          volume: '12000000000000000000',
          payoutTime: '1672714503',
          closer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
          __typename: 'Payout',
        },
      ],
      claimedTransactionHash: '0x70bbcc0406cfb20dd14c9095c10a0a34162d66133a36f8e7a3b5b0358d6924fe',
      payoutAddress: null,
      status: '1',
      bountyType: '0',
      closer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
      deposits: [
        {
          id: '0x278841875917899f6acdaa5ffc6fe91910692059988c7665d0a7ae0fc3ea0514',
          refunded: false,
          receiveTime: '1672714477',
          tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
          expiration: '2592000',
          volume: '12000000000000000000',
          tokenId: '0',
          isNft: false,
          refundTime: null,
          sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
          __typename: 'Deposit',
        },
        {
          id: '0xa40bf6a13dd29aa3a0dfb222126995fcce25be9dfdc1fcf8c429c6f48d5eca60',
          refunded: false,
          receiveTime: '1672714459',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          expiration: '2592000',
          volume: '12000000000000000000',
          tokenId: '0',
          isNft: false,
          refundTime: null,
          sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
          __typename: 'Deposit',
        },
      ],
      refunds: [],
      bountyTokenBalances: [],
      issuer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
      __typename: 'Bounty',
    };
  }
  static get request0() {
    return {
      requestingUser: {
        email: 'abc123@gmail.com',

        username: 'Christopher',
        watchedBounties: undefined,
      },
    };
  }
  static get request1() {
    return {
      requestingUser: {
        email: 'abc123@gmail.com',

        username: 'Christopher',
        watchedBounties: undefined,
      },
    };
  }
  static get bounty0() {
    return Constants.bounty;
  }
  static get bounty1() {
    return {
      ...Constants.bounty,
      // split price should now only have one token type of deposits
      deposits: [Constants.deposit1, Constants.deposit4, Constants.deposit5],
      bountyType: Constants.bountyTypeSplit,
      payoutTokenAddress: Constants.zeroAddress,
      payoutTokenVolume: Constants.payoutTokenVolume,
    };
  }
  static get bounty2() {
    return {
      ...Constants.bounty,
      payoutSchedule: Constants.payoutSchedule2,
      bountyType: Constants.bountyTypeContest,
    };
  }
  static get bounty3() {
    return {
      ...Constants.bounty,
      payoutSchedule: Constants.payoutSchedule3,
      payoutTokenAddress: Constants.linkAddress,
      bountyType: Constants.bountyTypeFixedContest,
      requests: { nodes: [Constants.request0] },
    };
  }

  static get bounties() {
    return [Constants.bounty0, Constants.bounty1, Constants.bounty2, Constants.bounty3];
  }

  static get membersWithRole() {
    return {
      __typename: 'OrganizationMemberConnection',
      nodes: [
        {
          __typename: 'User',
          avatarUrl: 'https://avatars.githubusercontent.com/u/28826387?u=34c5f1594ad1ce83b111390b604ed5d26e389815&v=4',
          name: 'Rick',
          login: 'rickkdev',
          url: 'https://github.com/rickkdev',
        },
        {
          __typename: 'User',
          avatarUrl: 'https://avatars.githubusercontent.com/u/47331078?u=05e9f2d42bf22bbdaa4c623fffbe590150bb5143&v=4',
          name: 'Deep Patel',
          login: 'Deep1144',
          url: 'https://github.com/Deep1144',
        },
        {
          __typename: 'User',
          avatarUrl: 'https://avatars.githubusercontent.com/u/73331595?u=ab23f1fb829a2e840a1f377757d62612e72c9d59&v=4',
          name: 'Sachin',
          login: '0xSachinK',
          url: 'https://github.com/0xSachinK',
        },
      ],
    };
  }

  static get organizationData() {
    return {
      __typename: 'Organization',
      id: 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4',
      bountiesCreated: Constants.bounties,
      fundedTokenBalances: [
        {
          __typename: 'OrganizationFundedTokenBalance',
          id: 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4-0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
          tokenAddress: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
          volume: '2000000000000000000',
        },
        {
          __typename: 'OrganizationFundedTokenBalance',
          id: 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4-0x5fbdb2315678afecb367f032d93f642f64180aa3',
          tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
          volume: '1000000000000000000',
        },
        {
          __typename: 'OrganizationFundedTokenBalance',
          id: 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4-0x0000000000000000000000000000000000000000',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          volume: '1000000000000000000',
        },
      ],
      deposits: Constants.deposits,
      refunds: [],
      payouts: [],
      payoutTokenBalances: [],
      name: 'OpenQ Labs',
      login: 'OpenQDev',
      createdAt: '2021-01-13T16:10:08Z',
      description: 'Free, open-source work platform tailored for software development',
      email: 'info@openq.dev',
      websiteUrl: 'https://www.openq.dev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
      isVerified: false,
      descriptionHTML: '<div>Free, open-source work platform tailored for software development</div>',
      location: 'GitHub',
      twitterUsername: 'openqlabs',
      url: 'https://github.com/OpenQDev',
      membersWithRole: Constants.membersWithRole,
    };
  }
}
