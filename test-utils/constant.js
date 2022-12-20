export default class Constants {
  constructor() {}

  static get bountyId() {
    return 'I_kwDOGAqhQc48U5_r';
  }
  static get title() {
    return 'test2';
  }
  static get body() {
    return 'body of test2';
  }
  static get url() {
    return 'https://github.com/OpenQDev/OpenQ-Frontend/issues/8';
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
  static get titleHTML() {
    return 'test2';
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
  static get prs() {
    return [];
  }
  static get closedEvents() {
    return [Constants.closedEvent1];
  }
  static get closedAt() {
    return '2021-09-28T17:57:44Z';
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
      createdAt: '2021-09-28T17:57:44Z',
      actor: {
        __typename: 'Actor',
        login: 'OpenQDev',
        avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
      },
    };
  }
  static get bountyAddress() {
    return '0x3c57cd59335d9a56b76feb48b3925d095e7e8e9f';
  }
  static get bountyMintTime() {
    return '1661767971';
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
  static get payoutSchedule() {
    return null;
  }
  static get closerData() {
    return null;
  }
  static get bountyType() {
    return '1';
  }
  static get claimedTransactionHash() {
    return null;
  }
  static get deposits() {
    return [Constants.deposit1, Constants.deposit1, Constants.deposit1];
  }
  static get deposit1() {
    return {
      __typename: 'Deposit',
      id: '0x5fad7d4850474383e594afa53cedd57709f994d3da7787d72ecd4d4f0b6e1264',
      refunded: false,
      refundTime: null,
      expiration: '30',
      amount: '100',

      depositor: {
        __typename: 'Deposit',
        id: '0x5fad7d4850474383e594afa53cedd57709f994d3da7787d72ecd4d4f0b6e1264',
        refunded: false,
        refundTime: null,
        expiration: '30',
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        volume: '2000000000000000000',
        sender: { __typename: 'User', id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' },
        receiveTime: '1661768003',
      },
    };
  }

  static get refunds() {
    return [];
  }
  static get payouts() {
    return [];
  }
  static get issuer() {
    return {
      __typename: 'User',
      id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    };
  }
  static get bountyTokenBalances() {
    return [Constants.bountyTokenBalanceMatic, Constants.bountyTokenBalance1, Constants.bountyTokenBalance1];
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
    return process.env.MOCK_LINK_TOKEN_ADDRESS;
  }
  static get daiAddress() {
    return process.env.MOCK_DAI_TOKEN_ADDRESS;
  }
  static get maticAddress() {
    return '0x0000000000000000000000000000000000000000';
  }
  static get tvl() {
    return '0';
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
  static get bounty() {
    return {
      __typename: 'Bounty',
      id: Constants.address,
      organizationId: Constants.organizationId,
      type: Constants.type,
      category: Constants.category,
      watchingCount: Constants.watchingCount,
      blacklisted: Constants.blacklisted,
      organization: Constants.organization,
      title: Constants.title,
      body: Constants.body,
      createdAt: Constants.createdAt,
      updatedAt: Constants.updatedAt,
      closedAt: Constants.closedAt,
      deadline: Constants.deadline,
      issuer: Constants.issuer,
      bountyTokenBalances: Constants.bountyTokenBalances,
      tvl: Constants.tvl,
      repoUrl: Constants.repoUrl,
      repoDescription: Constants.repoDescription,
      closedEvent: Constants.closedEvent1,
      bountyAddress: Constants.bountyAddress,
      bountyMintTime: Constants.bountyMintTime,
      bountyClosedTime: Constants.bountyClosedTime,
      status: Constants.status,
      fundingGoalTokenAddress: Constants.fundingGoalTokenAddress,
      fundingGoalVolume: Constants.fundingGoalVolume,
      payoutTokenVolume: Constants.payoutTokenVolume,
      payoutTokenAddress: Constants.payoutTokenAddress,
      payoutSchedule: Constants.payoutSchedule,
      closerData: Constants.closerData,
      bountyType: Constants.bountyType,
      claimedTransactionHash: Constants.claimedTransactionHash,
      deposits: Constants.deposits,
      refunds: Constants.refunds,
      payouts: Constants.payouts,
      languages: [Constants.language1, Constants.language2, Constants.language3, Constants.language4],
      labels: [Constants.label1, Constants.label2, Constants.label3, Constants.label4, Constants.label5],
      comments: [Constants.comment1, Constants.comment2, Constants.comment3, Constants.comment4, Constants.comment5],
      events: [Constants.closedEvent1],
      watchers: [Constants.watcher1, Constants.watcher2, Constants.watcher3, Constants.watcher4, Constants.watcher5],
      bountyFundedTokenBalances: [
        Constants.bountyTokenBalanceMatic,
        Constants.bountyTokenBalanceDai,
        Constants.bountyTokenBalanceLink,
      ],
    };
  }
}
