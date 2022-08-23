import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

export default function IssueDetailsBubble({ issueData }) {
	const [appState] = useContext(StoreContext);

	return (
		<>
			<div className="flex flex-col px-6 py-2 pl-5 w-full items-center">
				<div className="flex flex-row  items-center space-x-2">
					<div className="">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill={ issueData?.closed ? '#F0431D' : '#15FB31' }
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
					<div className="break-word text-sm"> {issueData.title}</div>
				</div>
				<div className="text-xs pt-3 pl-6 text-gray-200">
					{' '}
											Created on {appState.utils.formatDate(issueData.createdAt)} { issueData.author && `by ${issueData.author.login}`}
				</div>
			</div>
		</>
	);
}
