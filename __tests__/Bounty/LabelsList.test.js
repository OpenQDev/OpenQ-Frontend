// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import LabelsList from '../../components/Bounty/LabelsList';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 

describe('LabelsList', ( ) => {
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

	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});

		
	it('should render at least one label', ()=>{
		// ARRANGE
		render(<LabelsList bounty={bounty} />);
		if(bounty.labels[0]){
			// ASSERT
			expect(screen.getByText(bounty.labels[0].name));
		}
		
			
		// should not have null or undefined values
		const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
		expect(nullish).toHaveLength(0);

			
	});

	


});