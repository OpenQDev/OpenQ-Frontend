import React, {useContext} from 'react';
import StoreContext from '../../store/Store/StoreContext';
import Link from 'next/link';

const CarouselBounty = ({bounty}) =>{
	const [appState] = useContext(StoreContext);
	return(
		
		<div className='border-web-gray bg-dark-mode w-44 sm:w-48 p-4 pl-2 gap-2 border rounded-lg flex'>
			<Link target={'_blank'} href={`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.bountyAddress}`}>
				<a>
					<svg
						flex-1
						xmlns="http://www.w3.org/2000/svg"
						fill={ bounty?.closed ? '#F0431D' : '#15FB31'}
						viewBox="0 0 16 16"
						width="19"
						height="19"
					>
						<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
						<path
							fillRule="evenodd"
							d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
						></path>
					</svg>
					<div className='flex-1 w-36'>
						<p className='text-normal leading-none truncate'>{bounty.owner.toLowerCase()}/{bounty.repoName.toLowerCase()}</p>
						<h4 className='text-normal font-semibold truncate leading-none mb-1'>{bounty.title.toLowerCase()}</h4>
						<p className='text-xs'>Issue opened: {appState.utils.formatDate(bounty?.createdAt, true)}</p>
						<p className='text-xs'>Bounty Minted: {appState.utils.formatUnixDate(parseInt(bounty?.bountyMintTime), true)}</p>
					</div>
				</a></Link>
		</div>
	);
};
export default CarouselBounty;