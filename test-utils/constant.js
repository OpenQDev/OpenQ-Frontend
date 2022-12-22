export default class Constants {
  constructor() {}
  static get githubUserId() {
    return 'MDQ6VXNlcjcyMTU2Njc5';
  }

  static get uuid() {
    return '63a3a266ab24d99d359a6d51';
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
    return 'I_kwDOGAqhQc48U5_r';
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
  static get pr1() {
    return {
      __typename: 'CrossReferencedEvent',
      id: 'CRE_kwDOGWnnz85GHUw1',
      assignees: Constants.assignees,
      referencedAt: '2022-03-28T17:47:26Z',
      source: {
        __typename: 'PullRequest',
        mergedAt: '2022-03-28T17:57:44Z',
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
    return '0x3c57cd59335d9a56b76feb48b3925d095e7e8e9f';
  }
  static get bountyMintTime() {
    return '1662545344';
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
    return [Constants.deposit1, Constants.deposit2, Constants.deposit3];
  }

  static get deposit1() {
    return {
      id: '0xe5551a3fa87d93a0c6c084d572b9e282114befc43dc68f08be6d53d13830e356',
      refunded: false,
      receiveTime: '1662545374',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      expiration: '1296000',
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
      receiveTime: '1662545373',
      tokenAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      expiration: '30',
      volume: '2000000000000000000',
      refundTime: '1662559726',
      sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
      __typename: 'Deposit',
    };
  }
  static get deposit3() {
    return {
      id: '0x7db2691e573b9c19e90f391cd3eda9ce9246666a1502f2bf87b9d47d13679bc0',
      refunded: false,
      receiveTime: '1662545372',
      tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
      expiration: '1296000',
      volume: '1000000000000000000',
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
      refundTime: '1662559726',
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
      payoutSchedule: Constants.payoutSchedule0,
    };
  }
}
