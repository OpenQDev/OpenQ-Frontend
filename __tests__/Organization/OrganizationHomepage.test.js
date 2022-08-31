
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import OrganizationHomepage from '../../components/Organization/OrganizationHomepage';
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

	const test =(orgs)=>{
		
		it('should render Org homepage', async()=>{
			// ARRANGE
			render(<OrganizationHomepage orgs={orgs} complete={true}/>);

			// ASSERT
			const title = screen.getByText(/OpenQ Labs/i);
			expect(title).toBeInTheDocument();
			const images = screen.getAllByRole('img');
			expect(images).toHaveLength(4);
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	};

	test(mergedOrgs);
});