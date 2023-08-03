/**
 * @typedef {import("@prismicio/client").Content.SubHeaderSlice} SubHeaderSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SubHeaderSlice>} SubHeaderProps
 * @param {SubHeaderProps}
 */
import React from 'react';
const SubHeader = ({ slice }) => {
  return (
    <div className='flex w-full justify-center bg-dark-mode z-10'>
      <div className='max-w-2xl w-full px-8 bg-dark-mode z-10'>
        <h3 className='text-3xl py-6 font-semibold '> {slice.primary.subheader[0].text}</h3>
      </div>
    </div>
  );
};

export default SubHeader;
