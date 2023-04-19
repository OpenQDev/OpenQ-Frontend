/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

const SelectableNFT = ({ nft, setSelectedNft, selectedNft, pickNft }) => {
  const uriRegex = /^https:\/\/||http:\/\/||\//;
  const vidRegex = /mp4$/;
  let selected =
    selectedNft && selectedNft.token_address === nft.token_address && nft.token_id === selectedNft.token_id;

  const hasImage = nft.metadata?.image?.match(uriRegex)[0] && !nft.metadata?.image?.match(vidRegex);
  const handleSelect = () => {
    if (!selected && setSelectedNft) {
      setSelectedNft(nft);
    }
  };
  return (
    <div className='relative'>
      <div
        className={`border-4 bg-nav-bg py-1 ${
          !selected && setSelectedNft && 'cursor-pointer'
        } rounded-md  h-76 border-dark-mode`}
        onClick={handleSelect}
      >
        <img
          className='w-full aspect-square block rounded-t-sm object-cover'
          width={200}
          height={200}
          src={hasImage ? nft.metadata?.image : '/crypto-logos/ERC20.svg'}
        />
        <h4 className='p-2 text-sm font-bold text-muted flex justify-between pr-4'>
          <div>{nft.name}</div>
          <div>#{nft.token_id}</div>
        </h4>
        {nft.token_uri ? (
          <Link href={nft.token_uri}>
            <div className='px-2 cursor-pointer  hover:underline pb-4 h-8 truncate text-sm font-bold text-primary'>
              {nft.metadata?.name}
            </div>
          </Link>
        ) : (
          <div className='px-2 pb-4 text-sm font-bold text-primary h-8  truncate overflow-y-auto'>
            {nft.metadata?.name}
          </div>
        )}
      </div>
      {selected && (
        <div
          className={`border-4 absolute inset-0 flex flex-col justify-end rounded-md  border-green hover:border-green-highlight bg-overlay`}
          onClick={handleSelect}
        >
          <button
            onClick={pickNft}
            className='p-3 bg-green hover:bg-green-highlight -mx-1 -mb-1 py-1 rounded-b-md cursor-pointer justify-center text-center text-white text-lg text-semibold'
          >
            Select
          </button>
        </div>
      )}
    </div>
  );
};
export default SelectableNFT;
