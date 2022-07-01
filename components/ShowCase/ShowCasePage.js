import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const ShowCasePage = ({pr, bounty}) => {


	return (
		<div className="m-auto pt-8 w-3/4">
			<h1 className='text-4xl text-tinted font-bold'>{pr.title}</h1>
			<Link href={pr.url}>
				<a className='text-tinted font-bold underline'>
						View Source
				</a>
			</Link>
			<div className='pt-8 text-lg'>	<div className='markdown-body' dangerouslySetInnerHTML={{__html: pr.bodyHTML}}></div>
				<div className='pt-16 '>Created by</div>
				<div className='flex gap-2 h-6'>
					<div>{pr.author.login}</div>
					<Link href={pr.author.url}>
						<a>
						
							<Image className='rounded-lg' src={pr.author.avatarUrl} height={'32px'} width={'32'} />
						</a>
					</Link>
				</div>{bounty.closer?.id?.length===42 && <CopyAddressToClipboard clipping={[5, 39]} data={bounty.closer.id}/>}
			
			</div>
		</div>);
};
export default ShowCasePage;