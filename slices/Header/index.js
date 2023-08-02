import React from 'react';
import Image from 'next/image';
/**
 * @typedef {import("@prismicio/client").Content.HeaderSlice} HeaderSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<HeaderSlice>} HeaderProps
 * @param {HeaderProps}
 */
const Header = ({ slice }) => {
  return (
    <div
      className='w-full px-8  h-[540px] overflow-hidden flex content-center justify-center items-center  bg-black'
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Image
        src={slice?.primary?.image?.url}
        width={1920}
        height={540}
        className='top-16 object-cover absolute w-full h-[540px] overflow-hidden'
      />
      <div className='opacity-80 z-10 w-full h-[540px] absolute bg-black'></div>
      <div className='z-10 flex flex-col content-center items-center'>
        <div className='text-4xl text-center md:text-left md:leading-tight md:text-6xl py-8 font-extrabold'>
          {slice.primary.header[0].text}
        </div>
        <div className='flex sm:flex-row gap-2 text-2xl text-muted '>
          <div className='whitespace-nowrap'>{slice.primary.authorfullname[0].text}</div>
          <div>•</div>
          <div className=''>{slice.primary.date}</div> <div className='md:block hidden'>•</div>
          <div className='md:block hidden'>{slice.primary.readtime[0].text}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
