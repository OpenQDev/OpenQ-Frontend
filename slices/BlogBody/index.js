/**
 * @typedef {import("@prismicio/client").Content.BlogBodySlice} BlogBodySlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BlogBodySlice>} BlogBodyProps
 * @param {BlogBodyProps}
 */
import { PrismicRichText } from '@prismicio/react';
import React from 'react';
const BlogBody = ({ slice }) => {
  return (
    <div className='max-w-lg rich-text w-full py-4'>
      <PrismicRichText field={slice.primary.richtext} />
    </div>
  );
};

export default BlogBody;
