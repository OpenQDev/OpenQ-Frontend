// Third Party
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';

// Custom
import StoreContext from '../../store/Store/StoreContext';

const BountyClosed = ({ bounty }) => {

	// State
	const [appState] = useContext(StoreContext);
	const [closer, setCloser] = useState('');

	// Hooks
	useEffect(async()=>{
		try{
			const closeEvent= await appState.githubRepository.fetchClosedEventByIssueId(bounty.id);
			setCloser(closeEvent.closer.author.login);
		}
		catch(err){
			console.error(err);

		}
	});
	
	const url=`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${bounty.claimedTransactionHash}`;

	//Render
	return (
		<div className="w-2/3 lg:w-1/2">
			<div className="flex flex-col space-y-5">
				<h2 className="flex text-3xl font-semibold text-white justify-center pt-16">Bounty Closed</h2>
				<div className="bg-purple-600 col-span-3 bg-opacity-20 border border-purple-700 rounded-lg text-white p-4">
					<p>Closer: {closer}</p>				
					<p>Closer Address: {bounty.payoutAddress}</p>
					<p>Closing Transaction: <Link href={url}>
						<span className="cursor-pointer break-words">
							<span className="underline">{url}</span> 
							{'  '}<svg className="h-3 inline" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 80v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48zm-88 16H248.029c-21.313 0-32.08 25.861-16.971 40.971l31.984 31.987L67.515 364.485c-4.686 4.686-4.686 12.284 0 16.971l31.029 31.029c4.687 4.686 12.285 4.686 16.971 0l195.526-195.526 31.988 31.991C358.058 263.977 384 253.425 384 231.979V120c0-13.255-10.745-24-24-24z"/>
							</svg>
						</span>
					</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default BountyClosed;
