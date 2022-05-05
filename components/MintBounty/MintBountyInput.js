import React from 'react';
import IssueDetailsBubble from './IssueDetailsBubble';

export default function MintBountyInput({ setIssueUrl, issueData, isValidUrl, url }) {
	return (
		<div className="bg-dark-mode border border-web-gray rounded-lg">
			<div
				className={`flex flex-row items-center p-2 rounded-lg py-1 text-base bg-dark-mode  ${isValidUrl && issueData ? 'pt-5' : null
				}`}
			>
				<input
					className="w-full bg-dark-mode px-5 p-1 border-web-gray outline-none"
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