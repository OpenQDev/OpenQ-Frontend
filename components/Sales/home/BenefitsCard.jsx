import Image from 'next/image';
import React from 'react';
const BenefitsCard = ({ src, forText, benefitsArray, children }) => {
  return (
    <div className='max-w-[400px] flex items-start lg:items-start flex-col gap-8 px-8'>
      <Image className='max-w-[372px] -mx-8' src={src} width={500} height={500} alt={`illustration with name ${src}`} />
      <h3 className='font-bold text-2xl self-left'>{forText}</h3>
      <ul className='sm:list-disc justify-center lg:justify-start space-y-2 text-muted text-xl'>
        {benefitsArray.map((benefit) => (
          <li className='relative lg:left-4 ' key={benefit}>
            <span> {benefit}</span>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
};

export default BenefitsCard;
