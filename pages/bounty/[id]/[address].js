// Third party
import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ethers } from 'ethers';
import useWeb3 from '../../../hooks/useWeb3';
import Link from 'next/link';

// Custom
import StoreContext from '../../../store/Store/StoreContext';
import BountyCardDetails from '../../../components/Bounty/BountyCardDetails';
import FundPage from '../../../components/FundBounty/FundPage';
import RefundPage from '../../../components/RefundBounty/RefundPage';
import ClaimPage from '../../../components/Claim/ClaimPage';
import AdminPage from '../../../components/Admin/AdminPage';
import useGetTokenValues from '../../../hooks/useGetTokenValues';
import UnexpectedError from '../../../components/Utils/UnexpectedError';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient';
import useAuth from '../../../hooks/useAuth';
import RepoTitle from '../../../components/Bounty/RepoTitle';
import SubMenu from '../../../components/Utils/SubMenu';
import BountyHeading from '../../../components/Bounty/BountyHeading';

import Add from '../../../components/svg/add';
import Subtract from '../../../components/svg/subtract';
import Fire from '../../../components/svg/fire';
import Telescope from '../../../components/svg/telescope';

const address = ({ address, mergedBounty, renderError }) => {
	useAuth();
	// Context
	const [appState, dispatch] = useContext(StoreContext);
	const [bounty, setBounty] = useState(mergedBounty);
	const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances);
	const [payoutValues] = useGetTokenValues(bounty?.payouts);
	const [refundValues] = useGetTokenValues(bounty?.refunds);

	
	const createBudget = (bounty)=>{
		return  bounty.fundingGoalTokenAddress ? {tokenAddress: bounty.fundingGoalTokenAddress, volume: bounty.fundingGoalVolume}: null;
	};
	const budgetObj = useMemo(() => createBudget(bounty), [
		bounty
	]);
	const [budgetValue] = useGetTokenValues(budgetObj);
	const budget = budgetValue?.total;
	const tokenTotal = tokenValues?.total;
	const payoutTotal = payoutValues?.total;
	const refundTotal = refundValues?.total;
	const TVL=tokenTotal - payoutTotal - refundTotal;
	const {account, } = useWeb3();
	console.log(bounty);

	// State
	const [error, setError] = useState(renderError);
	const [internalMenu, setInternalMenu] = useState();
	const [justMinted, setJustMinted] = useState();

	// Refs
	const canvas = useRef();

	// Methods
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
  
	const setReload = () => {
		const payload = {
			type: 'UPDATE_RELOAD',
			payload: true
		};
		dispatch(payload);
	};

	// Claim: Change in bounty.status
	// Group Fund/Refund/Extend Deposit in "JSON.stringify(newBounty.deposits) === JSON.stringify(bounty.deposits)" comparison 
	// Fund: Change in deposits length
	// Refund: Check that one of the deposits has been refunded
	// Extend Deposit: Change in deposit expiration 
	// No faster than 1 second so begin with a sleep so as to not spam the Graph Hosted Service
	const refreshBounty = async () => {
		await sleep(1000);
		let newBounty = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
		try {
			while (newBounty.status === bounty.status	
      && JSON.stringify(newBounty.deposits) === JSON.stringify(bounty.deposits)
      && newBounty.bountyClosedTime === bounty.bountyClosedTime
			&& newBounty.fundingGoalVolume === bounty.fundingGoalVolume
			&& newBounty.payoutTokenVolume === bounty.payoutTokenVolume
			&& newBounty.payoutSchedule === bounty.payoutSchedule) {
				newBounty = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
				await sleep(500);
			}
			const mergedBounty = { ...bounty, ...newBounty };
			setBounty(mergedBounty);
			setReload();
		}
		catch (error) {
			setError(true);
		}
	};

	useEffect(() => {
		if (internalMenu) {
			sessionStorage.setItem(address, internalMenu);
		}
	}, [internalMenu]);

	useEffect(()=> {
		setInternalMenu('View');
	}, [account]);

	// Hooks
	useEffect(async () => {
		const handleResize = () => {
			if (canvas.current?.width) {
				canvas.current.width = window.innerWidth;
				canvas.current.height = window.innerHeight;
			}
		};
		window.addEventListener('resize', handleResize, false);
		// Confetti
		const justMinted = sessionStorage.getItem('justMinted') === 'true';
		if (justMinted && canvas.current) {
			setJustMinted(true);
			setReload();
			canvas.current.width = window.innerWidth;
			canvas.current.height = window.innerHeight;

			const canvasConfetti = confetti.create(canvas.current, {
				resize: true,
				useWorker: true
			});
			canvasConfetti({
				particleCount: 50,
				spread: window.innerWidth,
				origin: {
					x: 1,
					y: 0,
				}
			});
			sessionStorage.setItem('justMinted', false);
		}
		// set route and populate
		if (address) {
			const route = sessionStorage.getItem(address);

			if (route !== internalMenu) {
				setInternalMenu(route || 'View');
			}
		}

		return () => window.removeEventListener('resize', handleResize);
	}, []);


	// User Methods

	// Render
	if (error) {
		return <UnexpectedError error={error} />;
	}
	else return (
		<>{!mergedBounty ?
			<div className='flex fixed inset-0 mx-20 justify-center items-center 
	 h-screen'>
				<div className='text-2xl'>Bounty not found. <span className="underline"><Link href={'/'}>Go home</Link>
				</span>
					.</div>
			</div> :
			<>
				<div className="flex flex-col justify-center items-center pt-4">
					<RepoTitle bounty={bounty} />
					<SubMenu colour="rust" items={[{ name: 'View', Svg: Telescope }, { name: 'Fund', Svg: Add }, { name: 'Refund', Svg: Subtract }, { name: 'Claim', Svg: Fire }, { name: (bounty.issuer && ethers.utils.getAddress(bounty?.issuer?.id) == account) ? 'Admin' : null, Svg: (bounty.issuer && ethers.utils.getAddress(bounty.issuer.id) == account) ? Telescope : null }]} internalMenu={internalMenu} updatePage={setInternalMenu} />

					<BountyHeading price={TVL} budget={budget} bounty={bounty} />
					{internalMenu == 'View' && <BountyCardDetails justMinted={justMinted} price={TVL} budget={budget} bounty={bounty} setInternalMenu={setInternalMenu} address={address} tokenValues={tokenValues} internalMenu={internalMenu} />}
					{internalMenu == 'Fund' && bounty ? <FundPage bounty={bounty} refreshBounty={refreshBounty} /> : null}
					{internalMenu == 'Claim' && bounty ? <ClaimPage bounty={bounty} refreshBounty={refreshBounty} /> : null}
					{internalMenu == 'Admin' && bounty && (ethers.utils.getAddress(bounty.issuer.id) == account) ? <AdminPage bounty={bounty} refreshBounty={refreshBounty} /> : null}
					{bounty && <RefundPage bounty={bounty} refreshBounty={refreshBounty} internalMenu={internalMenu} />}
					<canvas className="absolute w-full top-0 z-40 bottom-0 pointer-events-none" ref={canvas}></canvas>
				</div>
			</>}
		</>
	);
};

export const getServerSideProps = async (context) => {
	const openQSubgraphClient = new WrappedOpenQSubgraphClient();
	const githubRepository = new WrappedGithubClient();
	const openQPrismaClient = new WrappedOpenQPrismaClient();
	githubRepository.instance.setGraphqlHeaders();
	const { id, address } = context.query;
	let bountyMetadata = {};
	let renderError = '';
	try {
		bountyMetadata = await openQPrismaClient.instance.getBounty(ethers.utils.getAddress(address));
	}
	catch (err) {
		console.log(err);
	}
	let mergedBounty = null;
	let issueData = {};
	let bounty = {};
	try {
		issueData = await githubRepository.instance.fetchIssueById(id);
	}
	catch (err) {
		console.log(err);
		renderError = 'OpenQ could not find the issue connected to this to contract on Github.';
	}
	try {
		bounty = await openQSubgraphClient.instance.getBounty(address, 'no-cache');
		console.log(bounty);
		if (!bounty) {
			console.log('could not find bounty on graph');
		}
		mergedBounty = { ...issueData, ...bountyMetadata, ...bounty, bountyAddress: address };
	}
	catch (err) {
		console.log(err);
	
		renderError = `OpenQ could not find a contract with address: ${address}.`;
	}
	return { props: { id, address, mergedBounty, renderError } };
};

export default address;
