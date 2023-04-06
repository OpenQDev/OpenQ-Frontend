import React, { useContext } from 'react';
import Image from 'next/image';
import TokenContext from '../TokenStore/TokenContext';

const SelectedTokenImg = () => {
  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;
  return (
    <>
      {' '}
      <div className='flex h-4 w-4 items-center justify-center'>
        <Image
          src={token.path || token.logoURI || '/crypto-logos/ERC20.svg'}
          className='rounded-full'
          alt='selected token'
          width={40}
          height={40}
        />
      </div>
      <div className='flex pl-2 pr-1 text-primary'>{token.symbol}</div>
    </>
  );
};
export default SelectedTokenImg;
