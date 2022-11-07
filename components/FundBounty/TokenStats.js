import React from 'react';
import Image from "next/legacy/image";

const TokenStats = ({ volume, token, pickedNft }) => {
  return (
    <>
      {pickedNft ? (
        <div className='flex gap-2'>
          <img className='w-8 h-8 aspect-square' src={pickedNft.metadata.image} />
          <span className='truncate inline'>
            {pickedNft.name} #{pickedNft.token_id} {pickedNft.metadata.name}
          </span>
        </div>
      ) : (
        <>
          <Image
            width={24}
            className='inline'
            height={24}
            src={token.path || token.logoURI || '/crypto-logos/ERC20.svg'}
          />
          <span>
            {volume} {token.symbol}
          </span>
        </>
      )}
    </>
  );
};

export default TokenStats;
