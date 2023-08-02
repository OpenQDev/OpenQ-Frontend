import React, { useEffect, useState } from 'react';
import { createClient } from '../../prismicio';
import Image from 'next/image';
import Link from 'next/link';
const Blog = ({ latestBlogPosts }) => {
  console.log(latestBlogPosts[0].data.slices.find((slice) => slice.slice_type === 'header'));
  const [isHidden, setIsHidden] = useState(false);
  // when scroll is more than 1000 hide the header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`w-full`}>
      <div
        className={`w-full px-8 fixed h-[540px]  overflow-hidden flex content-center justify-center items-center  ${
          isHidden && 'invisible'
        }  bg-black`}
      >
        <Image
          src={'/landingpage/home/blog-image.png'}
          width={1920}
          height={540}
          className='top-16 object-cover absolute w-full h-[540px] overflow-hidden'
        />
        <div className='opacity-80 z-10 w-full h-[540px] absolute bg-black'></div>
        <div className='z-10 flex flex-col content-center items-center'>
          <div className='text-4xl text-center md:text-left md:leading-tight md:text-6xl py-8 font-extrabold'>
            Thoughts from our team
          </div>
          <div className='text-2xl font-semibold max-w-[800px] text-center'>
            Delving Deep into the Developer Economy: Insights, Innovations, and Inspirations from OpenQ's Stewards
          </div>
        </div>
      </div>
      <div className='h-[540px] w-full'></div>
      <div className='flex w-full '>
        <div className='h-screen bg-dark-mode z-10 w-full flex justify-center '>
          <div className='px-6 grid md:grid-cols-[360px_360px] xl:grid-cols-[360px_360px_360px] grid-rows-[240px_240px_240px] md:justify-items-start  md:justify-between gap-4 p-8 lg:max-w-7xl '>
            {latestBlogPosts.map((data) => {
              const header = data.data.slices.find((slice) => slice.slice_type === 'header');
              console.log(data, 'hero');
              return (
                <Link
                  href={data.url}
                  className=' rounded-lg border-web-gray hover:border-muted border overflow-hidden relative w-[270px]   sm:w-[360px]  h-[240px]'
                  key={data.url}
                >
                  <div className=' absolute bottom-0 p-8 z-20'>
                    <div className=' text-xl font-bold'>{header.primary.header[0].text}</div>
                    <div className='flex flex-col sm:flex-row sm:gap-4'>
                      <div>{header.primary.authorfullname[0].text}</div>
                      <div className='hidden sm:block'>•</div>
                      <div>{header.primary.readtime[0].text}</div>
                    </div>
                  </div>
                  <div className='bg-black/70 hover:bg-black/50 absolute inset-0 z-10 w-[270px]  sm:w-[360px]  h-[240px]'>
                    {' '}
                  </div>
                  <Image
                    src={header.primary.image.url}
                    height={480}
                    width={480}
                    className='object-cover rounded-lg absolute z-0 top-0 w-[270px]  sm:w-[360px]  h-[240px]'
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const client = createClient();
  const latestBlogPosts = await client.getAllByType('blog_post', {
    fetchOptions: {
      cache: 'no-store',
      next: { tags: ['prismic', 'blog_posts'] },
    },
    limit: 3,
    orderings: [
      {
        field: 'my.blog_post.published_on',
        direction: 'desc',
      },
    ],
  });
  return { props: { latestBlogPosts } };
};

export default Blog;
