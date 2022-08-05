// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../test-utils';
import BountyList from '../../components/BountyList/BountyList';
import InitialState from '../../store/Store/InitialState';
import mocks from '../../__mocks__/mock-server.json';
 

describe('BountyList', ( ) => {
	const newBounties = mocks.bounties;	
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	const fullBounties = InitialState.utils.combineBounties(newBounties, issueData);
	const contractAddresses = mocks.watchedBounties.bounties.map(bounty=>bounty.address.toLowerCase());
	const subgraphBounties =  newBounties.filter(bounty=>contractAddresses.includes(bounty.bountyAddress));
	const githubIds = subgraphBounties.map(bounty=>bounty.bountyId);
	const githubBounties =InitialState.githubRepository.parseIssuesData( mocks.githubIssues).filter(issue=>githubIds.includes(issue.id));
	const watchedBounties = subgraphBounties.map((bounty, index)=>{return {...bounty, ...githubBounties[index]};});

	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();
		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});
	const test =(bounties)=>{
		
		it('should allow user to open BountyCardDetailsModal', async()=>{
			const user = userEvent.setup();
			// ARRANGE
			render(<BountyList bounties={bounties} complete={true}/>);

			// ACT
			const title = screen.getAllByText(/good first Issue/i);
			expect(title[0]).toBeInTheDocument();
			await user.click(title[0]);
			const titles =await screen.findAllByText(/good first issue/i);
			const link = await screen.findAllByText(/Full contract/i);

			// ASSERT
			expect(titles[1]).toBeInTheDocument();
			expect(link[0]).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);
			
		});
		it('should allow user to search by text and tags', async()=>{
			const user = userEvent.setup();
			// ARRANGE
			render(<BountyList bounties={bounties} complete={true}/>);

			// ASSERT
			const filteredIssue1 = screen.getAllByText(/Yoheikikuta\/bert-japanese/i);
			expect(filteredIssue1[0]).toBeInTheDocument();
			const unFilteredIssue = screen.getAllByText(/good first Issue/i);
			
			const search = screen.getByLabelText(/search text/i);
			expect(search).toBeInTheDocument();

			await user.type(search, 'Good first issue');
			expect(unFilteredIssue[0]).toBeInTheDocument();
			expect(filteredIssue1[0]).not.toBeInTheDocument();

			//		await user.click(await screen.findByLabelText(/remove l2e filter/i));
			//		expect(await screen.findByText(/Yoheikikuta\/bert-japanese/i)).toBeInTheDocument();		
		});

		it('should allow the user to show unfunded', async()=>{
		
			const user = userEvent.setup();
			// ARRANGE
			render(<BountyList bounties={bounties} complete={true}/>);

			// ACT
			expect(screen.queryByText(/way to disable hmr/)).not.toBeInTheDocument();
			await user.click(screen.getByText(/All Issues/i));
			expect(await screen.findByText(/way to disable hmr/)).toBeInTheDocument();		
		});

		it('should allow the user to show claimed', async()=>{
		
			const user = userEvent.setup();
			// ARRANGE
			render(<BountyList bounties={bounties} complete={true}/>);

			// ACT
			expect(screen.queryByText(/bot test/)).not.toBeInTheDocument();
			await user.click(screen.getByText(/All Issues/i));
			expect(await screen.findByText(/bot test/)).toBeInTheDocument();		
		});

		it('should allow the user to show assigned', async()=>{
		
			const user = userEvent.setup();
			// ARRANGE
			render(<BountyList bounties={bounties} complete={true}/>);

			// ACT
			expect(screen.queryByText(/sdf/)).not.toBeInTheDocument();
			await user.click(screen.getByText(/All Issues/i));
			const elements = await screen.findAllByText(/sdf/);
			expect(elements[0]).toBeInTheDocument();

		
		});
		
		/*
		it('should allow the user to only show L2E', async()=>{
		
			const user = userEvent.setup();
			// ARRANGE
			render(<BountyList bounties={bounties} complete={true}/>);

			// ACT
			expect(screen.queryByText(/Yoheikikuta\/bert-japanese/i)).toBeInTheDocument();
			await user.click(screen.getByLabelText('L 2 E'));
			expect(screen.queryByText(/Yoheikikuta\/bert-japanese/i)).not.toBeInTheDocument();		
		});
*/

		it('should allow the user to sort by age', async()=>{
		
			const user = userEvent.setup();
			// ARRANGE
			render(<BountyList bounties={bounties} complete={true}/>);

			// ASSERT
			await user.click(screen.getByText(/Sort Order/));
			await user.click(screen.getByRole('button', {name: /newest/i}));
			expect( screen.getAllByTestId('title')[0].textContent).toBe('yoheikikuta\/bert-japanese');
			expect( screen.getAllByTestId('title')[1].textContent).toBe('openqdev/openq-testrepo');
			await user.click(screen.getByRole('button', {name: /oldest/i}));
			expect( screen.getAllByTestId('title')[0].textContent).toBe('openqdev/openq-testrepo');								
			expect( screen.getAllByTestId('title')[1].textContent).toBe('yoheikikuta\/bert-japanese');			
			expect(screen.getAllByText(/Yoheikikuta\/bert-japanese/i)[0]).toBeInTheDocument();		
		});

		it('should render watched bounties', ()=>{
			// ARRANGE
			render(<BountyList addCarousel={true} watchedBounties={watchedBounties} bounties={bounties} complete={true}/>);

			// ASSERT
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);		
		});
	};

	test(fullBounties);
});