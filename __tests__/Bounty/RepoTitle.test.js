
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import RepoTitle from '../../components/Bounty/RepoTitle';
 
// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('RepoTitle', ( ) => {

	const tokenValues = {'tokenPrices':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':0.67},'tokens':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':8.040000000000001},'total':8.04};


	const bounty = {
		'__typename': 'Issue',
		'closed': false,
		'title': 'Good first issue',
		'body': 'This is a good first issue',
		'url': 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/221',
		'number': '221',
		'id': 'I_kwDOGWnnz85I9Ahl',
		'titleHTML': 'Good first issue',
		'bodyHTML': '<p dir="auto">This is a good first issue</p>',
		'assignees': {
			'__typename': 'UserConnection',
			'nodes': []
		},
		'labels': {
			'__typename': 'LabelConnection',
			'edges': [
				{
					'__typename': 'LabelEdge',
					'node': {
						'__typename': 'Label',
						'name': 'L2E',
						'color': 'fbca04'
					}
				}
			]
		},
		'createdAt': '2022-05-03T11:05:14Z',
		'repoName': 'OpenQ-TestRepo',
		'owner': 'OpenQDev',
		'repository': {
			'__typename': 'Repository',
			'id': 'R_kgDOGWnnzw',
			'name': 'OpenQ-TestRepo',
			
			'languages': {
				'__typename': 'LanguageConnection',
				'edges': [
					{
						'__typename': 'LanguageEdge',
						'node': {
							'__typename': 'Language',
							'name': 'JavaScript',
							'color': 'yellow'
						}
					}
				]
			},
			'owner': {
				'__typename': 'Organization',
				'login': 'OpenQDev',
				'avatarUrl': 'https://avatars.githubusercontent.com/u/77402538?v=4',
				'url': 'https://github.com/OpenQDev'
			}
		},
		'timelineItems': {
			'edges': []
		}
	};

	it('should render BountyDetails', async()=>{

		// Arrange
		render(<RepoTitle bounty={bounty} address={bounty.bountyAddress} tokenValues={tokenValues} />);

		// ASSERT
			
		const repoRegex = new RegExp(bounty.repoName, 'i');
		const repo = screen.getByText(repoRegex);
		expect(repo).toBeInTheDocument();
		const ownerRegex = new RegExp(bounty.owner, 'i');
		const owner = screen.getByText(ownerRegex);
		expect(owner).toBeInTheDocument();
			
	});

	
});