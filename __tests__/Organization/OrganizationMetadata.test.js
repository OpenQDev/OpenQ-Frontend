/**
 * @jest-environment jsdom
 */
import React from 'react';
import { waitFor } from '@testing-library/react';

import { render, screen } from '../../test-utils';
import InitialState from '../../store/Store/InitialState';
import OrganizationMetadata from '../../components/Organization/OrganizationMetadata';
import mocks from '../../__mocks__/mock-server.json';
import renderer from 'react-test-renderer';

describe('OrganizationMetadata', () => {
  let mergedOrgs = mocks.organizations.map((org) => {
    let currentGithubOrg;
    for (const githubOrganization of mocks.githubOrganizations) {
      if (org.id === githubOrganization.id) {
        currentGithubOrg = githubOrganization;
      }
    }
    return { ...org, ...currentGithubOrg };
  });

  const test = (organization) => {
    const githubIds = organization.bountiesCreated.map((bounty) => bounty.bountyId);
    const githubBounties = InitialState.githubRepository
      .parseIssuesData(mocks.githubIssues)
      .filter((issue) => githubIds.includes(issue.id));
    const bounties = organization.bountiesCreated.map((bounty, index) => {
      return { ...bounty, ...githubBounties[index] };
    });

    const repositories = bounties.reduce((repositories, bounty) => {
      if (repositories.some((repo) => repo.name === bounty.repoName)) {
        return repositories;
      }
      return [
        ...repositories,
        {
          name: bounty.repoName,
          languages: bounty.languages,
          description: bounty.repoDescription,
          url: bounty.repoUrl,
        },
      ];
    }, []);
    it('should match DOM Snapshot', () => {
      const tree = renderer.create(
        <OrganizationMetadata organizationData={organization} repositories={repositories} />
      );
      expect(tree.toJSON()).toMatchSnapshot();
    });
    it('should render Org homepage', async () => {
      // ARRANGE
      render(<OrganizationMetadata organizationData={organization} repositories={repositories} />);

      // ASSERT
      await waitFor(() => {
        if (organization.login === 'OpenQDev') {
          const language = screen.getByText(/JavaScript/i);
          expect(language).toBeInTheDocument();
        }
        if (organization.membersWithRole) {
          const images = screen.queryAllByRole('img');
          expect(images).toHaveLength(organization.membersWithRole.nodes.length);
        }

        // should not have null or undefined values
        const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
        expect(nullish).toHaveLength(0);
      });
    });
  };

  mergedOrgs.forEach((org) => test(org));
});
