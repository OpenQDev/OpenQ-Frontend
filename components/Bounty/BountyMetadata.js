import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import LabelsList from './LabelsList';
import CopyBountyAddress from './CopyBountyAddress';

const BountyMetadata = ({bounty, setInternalMenu, price})=>{


	return( 

		<ul className='md:max-w-[300px] w-full pl-4 pt-4'>
			<li className='border-b border-web-gray py-3'>
				<div className='text-xs font-semibold text-muted'>TVL</div>
				<button className='text-xs font-semibold text-primary' onClick={()=>setInternalMenu('Fund')}>${price||'0.00'}</button>
			</li>
			{bounty.assignees.length >0 && <li className='border-b border-web-gray py-3'>
				<div className='text-xs font-semibold text-muted'>Assignees</div>
					
				{bounty.assignees.map((assignee, index)=>{return 						<div key={index} className='flex gap-2 py-3'><Image className='rounded-lg inline-block py-4' height={24} width={24} src={assignee.avatarUrl}/>
					<div className='inline-block text-xs pt-1 font-semibold'>{assignee.name}</div>
							
				</div>;})}
			</li>}
			<li className='border-b border-web-gray py-3'>
				<div className='text-xs font-semibold text-muted'>Labels</div>
				<LabelsList bounty={bounty} />
			</li>
			<li className='border-b border-web-gray py-3 text sm'><Link href={`https://polygonscan.com/address/${bounty.bountyAddress}`}>
				<div className='text-xs font-semibold text-link-colour underline cursor-pointer'>Polygonscan</div>
			</Link>	
			{bounty.bountyAddress&&
					
						<CopyBountyAddress address={bounty.bountyAddress} />
			}
			</li>
			<li className='border-b border-web-gray py-3'>
				{bounty?.prs?.some(pr => pr.source['__typename'] === 'PullRequest' && pr.source.url) > 0 ? <ul>
						
					<div className='text-xs font-semibold text-muted'>Linked Pull Requests</div>
					{bounty.prs.filter((pr) => {
						return pr.source['__typename'] === 'PullRequest' && pr.source.url;
					}).map((pr, index) => {
						if (pr.source['__typename'] === 'PullRequest' && pr.source.url) {
							return <li className={`text-sm ${pr.source.merged ? 'text-claimed-bounty' : null}`} key={index}>
								<Link href={pr.source.url}>
									<a target="_blank" className={'underline'}>
										{pr.source.title}
									</a>
								</Link>
								<span> 
									{pr.source.merged ? ' (merged)' : ' (not merged)'}</span>
							</li>;}
					})}
				</ul> : <span>No linked pull requests</span>}
			</li>
			
		</ul>
	);
};
export default BountyMetadata;