import React from 'react';
import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';
import { createClient } from '../../prismicio';
export default function Home({ page }) {
  return (
    <div className='flex flex-col items-center content-center'>
      {page?.data && <SliceZone slices={page.data.slices} components={components} />}
    </div>
  );
}

export async function getStaticProps(props) {
  // Client used to fetch CMS content.
  const client = createClient();
  const { slug } = props.params;
  // Page document for our homepage from the CMS.
  const page = await client.getByUID('blog_post', slug);

  // Pass the homepage as prop to our page.
  return {
    props: { page },
  };
}

export async function getStaticPaths() {
  const client = createClient();

  const pages = await client.getAllByType('page');

  return {
    paths: pages.map((page) => prismic.asLink(page)),
    fallback: true,
  };
}
