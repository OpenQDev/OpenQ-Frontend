import React from 'react';
import Link from 'next/link';

export default function BountyAlreadyMintedMessage({ bountyAddress, closed, id }) {
  return (
    <div className='flex flex-row items-center space-x-1'>
      <div className=''>
        Bounty is already {closed ? 'closed' : 'minted'}, view{' '}
        <Link
          href={`/?address=${id}/${bountyAddress}}`}
          as={`/contract/${id}/${bountyAddress}`}
          target={'_blank'}
          rel='noreferrer'
          className='cursor-pointer text-link-colour hover:underline'
        >
          <span data-testid='link'>here</span>
        </Link>
        .
      </div>
    </div>
  );
}
