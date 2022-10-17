import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SelectableNFT = ({ nft, setSelectedNft, selectedNft, pickNft }) => {
  console.log(selectedNft);
  const uriRegex = /^https:\/\/||http:\/\/||\//;
  const vidRegex = /mp4$/;
  let selected = selectedNft && selectedNft.tokenAddress === nft.token_address && nft.token_id === selectedNft.tokenId;
  const hasImage = nft.metadata?.image?.match(uriRegex)[0] && !nft.metadata?.image?.match(vidRegex);
  const handleSelect = () => {
    if (!selected) {
      setSelectedNft({ tokenAddress: nft.token_address, tokenId: nft.token_id });
    }
  };
  return (
    <div className='relative'>
      <div
        className={`border-4 bg-nav-bg ${!selected && 'cursor-pointer'} rounded-md  h-72 border-dark-mode`}
        onClick={handleSelect}
      >
        <img
          className='w-full aspect-square block object-cover'
          width={200}
          height={200}
          src={hasImage ? nft.metadata?.image : '/crypto-logos/ERC20.svg'}
        />
        <h4 className='p-2 text-sm font-bold text-muted'>{nft.name}</h4>
        {nft.token_uri ? (
          <Link href={nft.token_uri}>
            <div className='px-2  hover:underline pb-4 h-2 truncate text-sm font-bold text-primary'>
              {nft.metadata?.name}
            </div>
          </Link>
        ) : (
          <div className='px-2 pb-4 text-sm font-bold text-primary h-2  truncate overflow-y-auto'>
            {nft.metadata?.name}
          </div>
        )}
      </div>
      {selected && (
        <div
          className={`border-4 absolute inset-0 flex flex-col justify-end rounded-md  border-green bg-overlay`}
          onClick={handleSelect}
        >
          <button
            onClick={pickNft}
            className='p-3 bg-green hover:bg-green-highlight -mx-1 -mb-1 rounded-b-md cursor-pointer justify-center text-center text-white text-lg text-semibold'
          >
            Fund
          </button>
        </div>
      )}
    </div>
  );
};
export default SelectableNFT;
