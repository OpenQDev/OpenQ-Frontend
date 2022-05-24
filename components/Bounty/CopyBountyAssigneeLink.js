// Third party
import React from 'react';
import Skeleton from 'react-loading-skeleton';

// Custom
import CopyAssigneeToClipboard from '../Copy/CopyAssigneeToClipboard';

const CopyBountyAssigneeLink = ({ bounty }) => {
	const assignee = bounty?.assignees[0];
	return (
		<div className="flex flex-col ">
			<div className="font-bold">Assignee</div>
			<div className="flex flex-row items-center space-x-2 cursor-pointer">
				{bounty ? 
					assignee?
						(
							<CopyAssigneeToClipboard name={assignee?.name} url={assignee?.url} /> 
						):<span>Unassigned</span>
					: (
						<Skeleton height={'28px'} width={'15rem'} />
					)}
			</div>
		</div>
	);
};

export default CopyBountyAssigneeLink;