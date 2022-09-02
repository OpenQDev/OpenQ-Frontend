
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import OrganizationCard from '../../components/Organization/OrganizationCard';
import mocks from '../../__mocks__/mock-server.json';
 

describe('OrganizationHomepage', ( ) => {
	let mergedOrgs = mocks.organizations.map((org) => {
		let currentGithubOrg;
		for (const githubOrganization of mocks.githubOrganizations) {
			if (org.id === githubOrganization.id) {
				currentGithubOrg = githubOrganization;
			}
		}
		return { ...org, ...currentGithubOrg };
	});

	const test =(org)=>{
		
		it('should render Org card', async()=>{
			// ARRANGE
			render(<OrganizationCard organization={org} />);
			const name = org.name || org.login;
			// ASSERT
			const nameRegex = new RegExp(name.slice(0, 3), 'i');
			const title = screen.getAllByText(nameRegex);
			expect(title[0]).toBeInTheDocument();
			const images = screen.getAllByRole('img');
			expect(images).toHaveLength(1);
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	};

	mergedOrgs.forEach((org)=>test(org));
});