/**
 * @typedef {import("@prismicio/client").Content.BlogImageSlice} BlogImageSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BlogImageSlice>} BlogImageProps
 * @param {BlogImageProps}
 */
import React from 'react';
import Image from 'next/image';
const BlogImage = ({ slice }) => {
  return (
    <div className='py-4 px-8 '>
      {slice?.primary?.blogimage?.url && (
        <Image
          className='w-full max-w-lg rounded-lg'
          src={slice?.primary?.blogimage?.url}
          width={slice?.primary?.blogimage?.dimensions?.width}
          height={slice?.primary?.blogimage?.dimensions?.height}
          alt='blog image'
        />
      )}
    </div>
  );
};

export default BlogImage;
