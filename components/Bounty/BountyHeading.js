// Third Party
import React, { useContext } from 'react';
import Link from 'next/link';
// Custom
import MintBountyButton from '../MintBounty/MintBountyButton';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';
const BountyHeading = ({bounty}) =>{

	const [appState] = useContext(StoreContext);
	const {total} = useGetTokenValues(bounty.bountyTokenBalances);
	return (
		<div className='sm:px-8 px-4 w-full max-w-[1200px] pb-4'>
			<div className='pt-6 pb-2 w-full flex flex-wrap'>
				<h1 className='text-[32px] flex-1 leading-tight'><span className='text-primary'>{bounty.title} </span>
					<Link href={bounty.url} className='text-muted text font-light'><a className='text-link-colour hover:underline'>#{bounty.number}</a></Link>
				</h1>
				<MintBountyButton styles={'h-8 self-center'}/>
			</div>
			<div className='w-full flex justify-between w-full pb-4 border-b border-web-gray'>
				<div className={`${bounty.status === 'OPEN' ? 'bg-important-button': 'bg-Closed'} py-2 font-light rounded-full px-4 flex gap-1  w-fit`}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className='fill-white'>
						<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z">
						</path></svg>
		
					<span className='leading-none'>
						{bounty.status === 'OPEN' ? 'Open': 'Claimed'}</span>
				</div>

				<span className='leading-loose text-lg font-semibold text-primary'>
					{bounty.status === 'OPEN' ? <svg xmlns="http://www.w3.org/2000/svg" className='inline fill-primary mb-1.5 mr-1' viewBox="0 0 16 16" width="16" height="16"><path fillRule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z">
					</path>
					</svg>:
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fillRule="evenodd" d="M5.5 4a2.5 2.5 0 014.607-1.346.75.75 0 101.264-.808A4 4 0 004 4v2h-.501A1.5 1.5 0 002 7.5v6A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5v-6A1.5 1.5 0 0012.5 6h-7V4zm-.75 3.5H3.5v6h9v-6H4.75z"></path></svg>
				
					}
					Total Value {bounty.status === 'OPEN' ? 'Locked': 'Claimed'} { appState.utils.formatter.format(
						total||0
					)}</span>
			</div>
		</div>);
};
export default BountyHeading;