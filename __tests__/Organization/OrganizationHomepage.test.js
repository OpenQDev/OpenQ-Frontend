/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import OrganizationHomepage from '../../components/Organization/OrganizationHomepage';

describe('OrganizationHomepage', () => {
  const orgs = [
    {
      blacklisted: false,
      id: 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4',
      starringUserIds: [],
      bounties: {
        nodes: [
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOGWnnz85Oi-oQ',
            address: '0x4dDd4eD2510ED5Ec3DCE3f0f67c3CB8EB5030f0A',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOGWnnz85AkiDt',
            address: '0x151499820f34E92D6a315e75E20Ee93B9bE14018',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOGWnnz85CZwGJ',
            address: '0xd9ac0186E4CB6Cb6a3e78b0b327d27B403A7F38D',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOGWnnz84-qyDq',
            address: '0x93FFA71dbc8706b703bb63C58f114D4f6836d383',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
          {
            tvl: 14.493048,
            tvc: 0,
            bountyId: 'I_kwDOGAqhQc48U5_r',
            address: '0x70A87cfB7d93284ea9Ad4834BBacbbd4b2A85bb4',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
          {
            tvl: 6.4,
            tvc: 0,
            bountyId: 'I_kwDOGWnnz85AkkDW',
            address: '0x9CbA1bd8bfe8F5376d45F0Ba25287c16FDBe0268',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
          {
            tvl: 7.246524000000001,
            tvc: 0,
            bountyId: 'I_kwDOGWnnz85GjwA1',
            address: '0xD2e813C297f3cf9985bAa5331CEC80778755BF2a',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
          {
            tvl: 38.4,
            tvc: 0,
            bountyId: 'I_kwDOE5zs-M480ik8',
            address: '0x2b961E3959b79326A8e7F64Ef0d2d825707669b5',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'Organization',
      name: 'OpenQ Labs',
      login: 'OpenQDev',
      description: 'Free, open-source work platform tailored for software development',
      avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
      url: 'https://github.com/OpenQDev',
    },
    {
      blacklisted: false,
      id: 'MDEyOk9yZ2FuaXphdGlvbjM0OTY2NDY0',
      starringUserIds: [],
      bounties: {
        nodes: [
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOCHE8585AYvGo',
            address: '0x532323de74BAb864b7005D910E5bD8562D038b9b',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'Organization',
      name: 'OpenSea',
      login: 'ProjectOpenSea',
      description: 'A marketplace for the decentralized web',
      avatarUrl: 'https://avatars.githubusercontent.com/u/34966464?v=4',
      url: 'https://github.com/ProjectOpenSea',
    },
    {
      blacklisted: false,
      id: 'MDEyOk9yZ2FuaXphdGlvbjM4OTE3MTM3',
      starringUserIds: [],
      bounties: {
        nodes: [
          {
            tvl: 12.8,
            tvc: 0,
            bountyId: 'I_kwDOB7jojM5HoxGM',
            address: '0x1f466F899d63CDE25eB4a857BC9725ADe0128439',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'Organization',
      name: 'Nomic Foundation',
      login: 'NomicFoundation',
      description: 'We build open source software to unlock developer productivity in the Ethereum ecosystem.',
      avatarUrl: 'https://avatars.githubusercontent.com/u/38917137?v=4',
      url: 'https://github.com/NomicFoundation',
    },
    {
      blacklisted: false,
      id: 'O_kgDOBiNoZQ',
      starringUserIds: [],
      bounties: {
        nodes: [
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOBhc8WM5Fqi_o',
            address: '0xFF83615517140c6737E221a3383c4c27CF0AAAC1',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'Organization',
      name: 'Safe Ecosystem',
      login: 'safe-global',
      description: 'Collection of production code that is used in the Safe Ecosystem',
      avatarUrl: 'https://avatars.githubusercontent.com/u/102983781?v=4',
      url: 'https://github.com/safe-global',
    },
    {
      blacklisted: false,
      id: 'MDEyOk9yZ2FuaXphdGlvbjEyNTIzMDI1',
      starringUserIds: [],
      bounties: {
        nodes: [
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOCQWAHM5EzBw7',
            address: '0x7a2a1BB961C74a0EBE106E4bafE229937b441d97',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'Organization',
      name: 'Maker',
      login: 'makerdao',
      description: '',
      avatarUrl: 'https://avatars.githubusercontent.com/u/12523025?v=4',
      url: 'https://github.com/makerdao',
    },
    {
      blacklisted: false,
      id: 'MDEyOk9yZ2FuaXphdGlvbjE0MTc2OTA2',
      starringUserIds: [],
      bounties: {
        nodes: [
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOCJdoNs5QCrBu',
            address: '0x537EcB09f77322F7Bb8B206bF0b0478e99B91125',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'Organization',
      name: 'Parity Technologies',
      login: 'paritytech',
      description: 'Solutions for a trust-free world',
      avatarUrl: 'https://avatars.githubusercontent.com/u/14176906?v=4',
      url: 'https://github.com/paritytech',
    },
    {
      blacklisted: false,
      id: 'MDEyOk9yZ2FuaXphdGlvbjE2OTI4MDg1',
      starringUserIds: [],
      bounties: {
        nodes: [
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOAAiu0c5P78Fn',
            address: '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'Organization',
      name: 'curl',
      login: 'curl',
      description: 'groks those URLs',
      avatarUrl: 'https://avatars.githubusercontent.com/u/16928085?v=4',
      url: 'https://github.com/curl',
    },
    {
      blacklisted: false,
      id: 'MDEyOk9yZ2FuaXphdGlvbjE3MjE5Mjg4',
      starringUserIds: [],
      bounties: {
        nodes: [
          {
            tvl: 0,
            tvc: 0,
            bountyId: 'I_kwDOC1sh0c5W6yQL',
            address: '0x001192Fa1EA7A2816445Ec2EFD5843c1a60562aa',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'Organization',
      name: 'Prisma',
      login: 'prisma',
      description: 'Prisma makes working with databases easy',
      avatarUrl: 'https://avatars.githubusercontent.com/u/17219288?v=4',
      url: 'https://github.com/prisma',
    },
  ];

  const test = (orgs) => {
    it('should render Org homepage', async () => {
      // ARRANGE
      render(<OrganizationHomepage orgs={orgs} complete={true} />);

      // ASSERT
      const title = screen.getAllByText(/OpenQ Labs/i);
      expect(title).toHaveLength(2);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(16);

      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };

  test(orgs);
});
