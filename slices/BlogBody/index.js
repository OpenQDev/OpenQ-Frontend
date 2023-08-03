/**
 * @typedef {import("@prismicio/client").Content.BlogBodySlice} BlogBodySlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BlogBodySlice>} BlogBodyProps
 * @param {BlogBodyProps}
 */
import { PrismicRichText } from '@prismicio/react';
import React from 'react';
const BlogBody = ({ slice }) => {
  console.log(slice);
  return (
    <div className='flex w-full justify-center bg-dark-mode z-10'>
      <div className='max-w-2xl text-xl px-8 rich-text w-full py-4'>
        <PrismicRichText className='text-xl' field={slice.primary.richtext} />
      </div>
    </div>
  );
};

export default BlogBody;
