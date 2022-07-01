
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PrCard = ({pr})=>{


	return(<>
		<Link href={`/showcase/${pr.id}/${pr.address}`}>
			<a className='cursor-pointer' >
				<div className='w-60 h-72 border-web-gray border rounded-lg p-6 flex flex-col align-center'>
					<Image width={'144'} height={'144px'} src={pr.repository.owner.avatarUrl}/>
					<h2 className='text-lg text-tinted font-bold'>{pr.title}</h2>
					<div className='leading-tight text-sm'>{pr.bodyText.slice(0, 70)} . . .</div>
				</div>
			</a>
		</Link>
	</>);
};

export default PrCard;