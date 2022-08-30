
/**
 * @jest-environment jsdom
 */
import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../test-utils';
import OrganizationContent from '../../components/Organization/OrganizationContent';

import nextRouter from 'next/router';


const orgBounties = [{ 'id': 'I_kwDOCHE8585AYvGo', 'title': 'How to estimate transaction fees for cancelling orders on opensea?', 'body': 'I am a little confused on how to find out how much it would cost to cancel a bid using the SDK. Current gwei price is arround 80 and opensea gives me a 30 USD transaction fee on medium when trying to cancel from their website.\r\n\r\nHow do they calculate these fees? Any way to calculate the cost using their SDK before sending the orders in?', 'url': 'https://github.com/ProjectOpenSea/opensea-js/issues/286', 'languages': [{ '__typename': 'Language', 'name': 'TypeScript', 'color': '#3178c6' }, { '__typename': 'Language', 'name': 'Shell', 'color': '#89e051' }, { '__typename': 'Language', 'name': 'JavaScript', 'color': '#f1e05a' }], 'repoName': 'opensea-js', 'owner': 'ProjectOpenSea', 'avatarUrl': 'https://avatars.githubusercontent.com/u/34966464?v=4', 'labels': [{ '__typename': 'Label', 'name': 'dev-documentation', 'color': 'c2e0c6' }, { '__typename': 'Label', 'name': 'dev-sdk-bug', 'color': '598E75' }], 'createdAt': '2021-12-14T20:52:29Z', 'closed': false, 'bodyHTML': '<p dir="auto">I am a little confused on how to find out how much it would cost to cancel a bid using the SDK. Current gwei price is arround 80 and opensea gives me a 30 USD transaction fee on medium when trying to cancel from their website.</p>\n<p dir="auto">How do they calculate these fees? Any way to calculate the cost using their SDK before sending the orders in?</p>', 'titleHTML': 'How to estimate transaction fees for cancelling orders on opensea?', 'assignees': [], 'number': 286, 'repoUrl': 'https://github.com/ProjectOpenSea/opensea-js', 'repoDescription': 'JavaScript SDK for the OpenSea marketplace. Let your users buy or sell cryptogoods on your own site!', 'prs': [], '__typename': 'Bounty', 'bountyAddress': '0x033488800ae672726c34620d4bd817e1590d4cdc', 'bountyType': '0', 'bountyId': 'I_kwDOCHE8585AYvGo', 'bountyMintTime': '1661767968', 'bountyClosedTime': null, 'claimedTransactionHash': null, 'fundingGoalTokenAddress': '0x0000000000000000000000000000000000000000', 'fundingGoalVolume': '0', 'status': '0', 'deposits': [], 'issuer': { '__typename': 'User', 'id': '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' }, 'bountyTokenBalances': [], 'refunds': [], 'payouts': [], 'tvl': 0, 'address': '0x033488800Ae672726c34620D4Bd817E1590d4cDc', 'blacklisted': false, 'category': 'prime' }];

const repositories = [{ 'name': 'bert-japanese', 'languages': [{ '__typename': 'Language', 'name': 'Dockerfile' }, { '__typename': 'Language', 'name': 'Python' }, { '__typename': 'Language', 'name': 'Shell' }, { '__typename': 'Language', 'name': 'Jupyter Notebook' }] }];

describe('OrganizationContent', () => {
	beforeEach(() => {
		const observe = jest.fn();
		const disconnect = jest.fn();


		nextRouter.useRouter = jest.fn();
		nextRouter.useRouter.mockImplementation(() => ({
			query: { type: null },

			prefetch: jest.fn(() => { return { catch: jest.fn }; })
		}));

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});


	it('should render Org content card for yoheikikuta', async () => {
		// ARRANGE
		const user = userEvent.setup();
		render(

			<OrganizationContent bounties={orgBounties} repositories={repositories} complete={true} />
		);
		const name = 'opensea';
		// ASSERT

		await user.click(screen.getByText(/all Issues/i));
		const nameRegex = new RegExp(name.slice(0, 3), 'i');
		const title = await screen.findAllByText(nameRegex);
		expect(title[0]).toBeInTheDocument();
		const images = screen.getAllByRole('img');
		expect(images).toHaveLength(orgBounties.length * 3 + 1);

		// should not have null or undefined values
		const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
		expect(nullish).toHaveLength(0);


	});


});