import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

export default function IssueDetailsBubble({ mintBountyState }) {
	const [appState] = useContext(StoreContext);

	return (
		<>
			{mintBountyState.isValidUrl && mintBountyState.issueFound && mintBountyState.issueData ? (
				<div className="flex flex-col pt-4 pl-5 ">
					<div className="flex flex-grow flex-row items-center space-x-2">
						<div className="">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="#15FB31"
								viewBox="0 0 16 16"
								width="17"
								height="17"
							>
								<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
								<path
									fillRule="evenodd"
									d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
								></path>
							</svg>
						</div>
						<div className="text-sm"> {mintBountyState.issueData.title}</div>
					</div>
					<div className="text-xs pt-3 pl-6 text-gray-400">
						{' '}
						created at {appState.utils.formatDate(mintBountyState.issueData.createdAt)} by {mintBountyState.issueData.author.login}
					</div>
				</div>
			) : null}
		</>
	);
}
