// Third party
import React, {  useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const TotalValue = ({tokenValues, bounty})=>{
	const [appState] = useContext(StoreContext);
	return (
		<span className='leading-loose text-base font-semibold text-primary'>
			{bounty.status === 'OPEN' ? 
				<svg xmlns="http://www.w3.org/2000/svg" className='inline fill-primary mb-1 mr-1' viewBox="0 0 16 16" width="16" height="16">
					<path fillRule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z">
					</path>
				</svg>:
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fillRule="evenodd" d="M5.5 4a2.5 2.5 0 014.607-1.346.75.75 0 101.264-.808A4 4 0 004 4v2h-.501A1.5 1.5 0 002 7.5v6A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5v-6A1.5 1.5 0 0012.5 6h-7V4zm-.75 3.5H3.5v6h9v-6H4.75z"></path></svg>
				
			}
					Total Value {bounty.status === 'OPEN' ? 'Locked': 'Claimed'} { appState.utils.formatter.format(
				tokenValues?.total||0
			)}</span>
	);
};
export default TotalValue;