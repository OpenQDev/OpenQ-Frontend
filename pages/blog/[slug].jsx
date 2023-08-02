import React from 'react';
import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';
import { createClient } from '../../prismicio';
import Head from 'next/head';
import { data } from 'autoprefixer';
export default function Home({ page }) {
  console.log(page);
  return (
    <div className='flex flex-col items-center content-center'>
      <Head>
        <meta property='og:image' content={data?.socialimage?.url} />
      </Head>
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
