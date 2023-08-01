/**
 * @typedef {import("@prismicio/client").Content.SubHeaderSlice} SubHeaderSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SubHeaderSlice>} SubHeaderProps
 * @param {SubHeaderProps}
 */
import React from 'react';
const SubHeader = ({ slice }) => {
  return (
    <div className='max-w-lg w-full' data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <h3 className='text-3xl py-6 '> {slice.primary.subheader[0].text}</h3>
    </div>
  );
};

export default SubHeader;
