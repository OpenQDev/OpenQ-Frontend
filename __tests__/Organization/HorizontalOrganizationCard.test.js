/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import HorizontalOrganizationCard from '../../components/Organization/HorizontalOrganizationCard';

describe('HorizontalOrganizationCard', () => {
  const orgs = [
    {
      blacklisted: false,
      id: 'MDEyOk9yZ2FuaXphdGlvbjIzNjE3OTYz',
      starringUsers: { nodes: [], __typename: 'Users' },
      bounties: {
        nodes: [
          {
            tvl: 0,
            tvc: null,
            bountyId: 'I_kwDOBG2gSc5UE3ei',
            address: '0x4bc9e77c3F545F413D20CA43D0f21258B606Cf9B',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
          {
            tvl: 4.0307394617,
            tvc: null,
            bountyId: 'I_kwDOBG2gSc5TwPbg',
            address: '0xcaDb87EC1cAdaD9C61da31F4AFF5ddF303625efA',
            blacklisted: false,
            category: null,
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'Organization',
      name: 'Svelte',
      login: 'sveltejs',
      description: 'Cybernetically enhanced web apps',
      avatarUrl: 'https://avatars.githubusercontent.com/u/23617963?v=4',
      url: 'https://github.com/sveltejs',
    },
    {
      blacklisted: false,
      id: 'U_kgDOBZIDuA',
      starringUsers: { nodes: [], __typename: 'Users' },
      bounties: {
        nodes: [
          {
            tvl: 0,
            tvc: null,
            bountyId: 'I_kwDOIG6ePM5TdvHh',
            address: '0x59e791E137138883a9aE3a0B2ce3573b36859A99',
            blacklisted: false,
            category: 'non-profit',
            __typename: 'Bounty',
          },
        ],
        __typename: 'Bounties',
      },
      __typename: 'User',
      name: null,
      login: 'FlacoJones',
      bio: 'builder at OpenQ',
      avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
      url: 'https://github.com/FlacoJones',
    },
  ];

  const test = (org) => {
    it('should render Horizontal Org card', async () => {
      // ARRANGE
      render(<HorizontalOrganizationCard organization={org} />);
      const name = org.name || org.login;
      // ASSERT
      const nameRegex = new RegExp(name.slice(0, 3), 'i');
      const title = screen.getAllByText(nameRegex);
      expect(title[0]).toBeInTheDocument();
      expect(screen.getByText('Star')).toBeInTheDocument();
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);

      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };

  orgs.forEach((org) => test(org));
});
