// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../test-utils';
import OrganizationContent from '../../components/Organization/OrganizationContent';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 

describe('OrganizationContent', ( ) => {
	let mergedOrgs = mocks.organizations.map((org) => {
		let currentGithubOrg;
		for (const githubOrganization of mocks.githubOrganizations) {
			if (org.id === githubOrganization.id) {
				currentGithubOrg = githubOrganization;
			}
		}
		return { ...org, ...currentGithubOrg };
	});
	
	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});

	const test =(org)=>{
		const githubIds = org.bountiesCreated.map(bounty=>bounty.bountyId);
		const githubBounties =InitialState.githubRepository.parseIssuesData( mocks.githubIssues).filter(issue=>githubIds.includes(issue.id));
		const bounties = org.bountiesCreated.map((bounty, index)=>{return {...bounty, ...githubBounties[index]};});

		const repositories = bounties.reduce((repositories, bounty)=>{
			if (repositories.some(repo=>repo.name===bounty.repoName)){
				return repositories;
			}
			return [...repositories, {name: bounty.repoName, languages: bounty.languagues, description: bounty.repoDescription, url: bounty.repoUrl}];
	
		},[]);
		it(`should render Org content card for ${org.login}`, async()=>{
			// ARRANGE
			const user  = userEvent.setup();
			render(<OrganizationContent bounties={bounties} repositories={ repositories} complete={true} organization={org} />);
			const name = org.name || org.login;
			// ASSERT

			await user.click(screen.getByText(/all Issues/i));
			const nameRegex = new RegExp(name.slice(0, 3), 'i');
			const title = await screen.findAllByText(nameRegex);
			expect(title[0]).toBeInTheDocument();
			const images = screen.getAllByRole('img');
			expect(images).toHaveLength(bounties.length* 4);
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	};

	mergedOrgs.forEach((org)=>test(org));
});