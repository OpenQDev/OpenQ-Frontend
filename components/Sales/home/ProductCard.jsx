import React from 'react';
import Image from 'next/image';
import { ChevronRightIcon } from '@primer/octicons-react';

const ProductCard = ({ imgSrc, productName, productDescription, productTarget }) => {
  return (
    <div className='border-muted bg-dark-2 w-[22rem] border rounded-lg overflow-hidden pt-6 h-min'>
      <div>
        <Image src={imgSrc} width={500} className='h-[320px]' height={0} alt={`illustration with name ${imgSrc}`} />
      </div>
      <div className='flex gap-2 py-4 text-lg content-center font-bold items-center px-6 border-b border-web-gray'>
        {productName} <ChevronRightIcon className='stroke-[1px] h-4 w-4 stroke-white' />
      </div>
      <div className='px-6 h-20 py-4'>{productDescription}</div>
      <div className='px-6 text-muted text-sm py-4 '>{productTarget}</div>
    </div>
  );
};

export default ProductCard;
