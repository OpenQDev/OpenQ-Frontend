
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import HorizontalOrganizationCard from '../../components/Organization/HorizontalOrganizationCard';
import mocks from '../../__mocks__/mock-server.json';
 

describe('HorizontalOrganizationCard', ( ) => {
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
		
		it('should render Horizontal Org card', async()=>{
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
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	};

	mergedOrgs.forEach((org)=>test(org));
});