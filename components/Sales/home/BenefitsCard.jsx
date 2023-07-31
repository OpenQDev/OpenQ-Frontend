import Image from 'next/image';
import React from 'react';
const BenefitsCard = ({ src, forText, benefitsArray, children }) => {
  return (
    <div className='max-w-[400px] flex items-center lg:items-start flex-col gap-8'>
      <Image className='max-w-[372px]' src={src} width={500} height={500} alt={`illustration with name ${src}`} />
      <h3 className='font-bold text-2xl'>{forText}</h3>
      <ul className='list-disc justify-center lg:justify-start space-y-2 text-muted text-xl'>
        {benefitsArray.map((benefit) => (
          <li className='relative left-4' key={benefit}>
            <span> {benefit}</span>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
};

export default BenefitsCard;
