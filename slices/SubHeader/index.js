/**
 * @typedef {import("@prismicio/client").Content.SubHeaderSlice} SubHeaderSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SubHeaderSlice>} SubHeaderProps
 * @param {SubHeaderProps}
 */
import React from 'react';
const SubHeader = ({ slice }) => {
  return (
    <div className='max-w-lg w-full px-8'>
      <h3 className='text-3xl py-6 font-semibold '> {slice.primary.subheader[0].text}</h3>
    </div>
  );
};

export default SubHeader;
