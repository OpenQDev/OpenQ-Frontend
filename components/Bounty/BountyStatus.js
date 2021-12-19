// Third Party
import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

// Custom

const BountyStatus = (props) => {
	const { bounty } = props;
	const [appState] = useContext(StoreContext);

	return (
		<>
			<div className="font-bold">Status</div>
			<div className="flex flex-row space-x-2 pt-2">
				<div className="pt-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill={bounty.closed ? '#F0431D' : '#15FB31'}
						viewBox="0 0 16 16"
						width="15"
						height="15"
					>
						<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
						<path
							fillRule="evenodd"
							d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
						></path>
					</svg>
				</div>
				<div className="flex space-x-1">
					<div>{bounty.status == 'OPEN' ? 'Unclaimed' : 'Claimed'}</div>
					<div>{appState.utils.formatDate(bounty.createdAt)}</div>
				</div>
			</div>
		</>
	);
};

export default BountyStatus;
