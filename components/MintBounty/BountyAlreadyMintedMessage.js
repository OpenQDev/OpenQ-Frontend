import React from 'react';
import Link from 'next/link';
import useWeb3 from '../../hooks/useWeb3';

export default function BountyAlreadyMintedMessage({ bountyAddress, closed, id }) {
  const { safe } = useWeb3();
  return (
    <div className='flex flex-row items-center space-x-1 pb-2 px-8'>
      <div className='text-white text-center'>
        Bounty is already {closed ? 'closed' : 'minted'}, view
        <Link
          href={`/?address=${id}/${bountyAddress}}`}
          as={`/contract/${id}/${bountyAddress}`}
          target={safe ? '_self' : '_blank'}
          rel='noreferrer'
          className='cursor-pointer text-link'
        >
          <span> &nbsp;here.</span>
        </Link>
      </div>
    </div>
  );
}
