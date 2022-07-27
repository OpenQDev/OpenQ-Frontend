// Third Party
import React from 'react';

// Custom
import MintBountyButton from '../MintBounty/MintBountyButton';
const BountyHeading = ({bounty}) =>{

	return (
		<div className='sm:px-8 px-4 w-full pb-4'>
			<div className='pt-6 pb-2 w-full flex flex-wrap'>
				<h1 className='text-[32px] flex-1 leading-tight'><span className='text-primary'>{bounty.title}</span><span className='text-muted text font-light'> #{bounty.number}</span></h1>
				<MintBountyButton styles={'h-8 self-center'}/>
			</div>
			<div className='w-full pb-4 border-b border-web-gray'>
				<div className='bg-important-button py-2 font-light rounded-full px-4 flex gap-1  w-fit'>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className='fill-white'>
						<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z">
						</path></svg>
		
					<span className='leading-none text-sm'>
		Open</span>
				</div>
			</div>
		</div>);
};
export default BountyHeading;