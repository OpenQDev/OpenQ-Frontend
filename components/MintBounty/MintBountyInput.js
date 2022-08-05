import React from 'react';
import IssueDetailsBubble from './IssueDetailsBubble';

export default function MintBountyInput({ setIssueUrl, issueData, isValidUrl, url }) {
	return (
		<div className="flex flex-col w-4/5 md:w-2/3">
			<div
				className={`flex flex-row w-full items-center p-2 rounded-lg py-1 text-base bg-[#161B22]  ${isValidUrl && issueData ? 'pt-5' : null
				}`}
			>
				<input
					className={'flex-1 input-field'}
					id="name"
					aria-label="issue url"
					placeholder="Issue URL"
					autoComplete="off"
					type="text"
					value={url}
					onChange={(event) => {
						setIssueUrl(event.target.value);
					}}
				/>
			</div>
			{isValidUrl && issueData ? <IssueDetailsBubble issueData={issueData}/> : null}
		</div>
	);
}