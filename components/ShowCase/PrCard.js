
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PrCard = ({pr})=>{


	return(
		<Link href={`/showcase/${pr.id}/${pr.address}`}>
			<a className='cursor-pointer' >
				<div className='w-60 h-80 border-web-gray border rounded-sm p-6 flex flex-col align-center'>
					<Image width={240} height={240} src={pr.repository.owner.avatarUrl}/>
					<h2 className='text-lg text-muted font-bold leading-tight'>{pr.title}</h2>
					<div className='leading-tight text-sm pt-4'>{pr.bodyText.slice(0, 70)} . . .</div>
				</div>
			</a>
		</Link>
	);
};

export default PrCard;