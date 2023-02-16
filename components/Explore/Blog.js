import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@primer/octicons-react';
import ImageTeaser from './ImageTeaser/ImageTeaser';
import ImageTeaserHeadline from './ImageTeaser/ImageTeaserHeadline';
import ImageTeaserLink from './ImageTeaser/ImageTeaserLink';
import ImageTeaserText from './ImageTeaser/ImageTeaserText';

export default function Blog() {
  const articles = [
    {
      title: 'Trust me bro',
      url: 'https://medium.com/openqdev/trust-me-bro-8fd8cf0a0e11',
      imageSrc: '/explore/blog-1.png',
      teaserText: 'How to get along with people you’ve never met',
    },
    {
      title: 'Web 2.0 DAO Part I',
      url: 'https://medium.com/openqdev/web-2-0-dao-part-i-4cec53dd0ec3',
      imageSrc: '/explore/blog-2.png',
      teaserText: 'How I’d (Fail) To Build a DAO in 2010',
    },
    {
      title: 'The Legend of the Code Vending Machine',
      url: 'https://medium.com/openqdev/the-legend-of-the-code-vending-machine-b30d3d573c4f',
      imageSrc: '/explore/blog-1.png',
      teaserText: 'Why no code is still a no go',
    },
  ];

  return (
    <div className='w-full pt-12 lg:pt-40 lg:pb-24'>
      <h1 className='text-center mb-10 mx-auto'>What we are thinking about</h1>
      <div className='grid grid-cols-1 gap-5 md:gap-10 sm:grid-cols-2 md:grid-cols-3'>
        {articles.map((article) => (
          <Link key={article.title} href={article.url} target='_blank'>
            <ImageTeaser imageSrc={article.imageSrc}>
              <ImageTeaserLink>
                Read more
                <ChevronRightIcon className='ml-2 w-5 h-5' />
              </ImageTeaserLink>
              <ImageTeaserHeadline>{article.title}</ImageTeaserHeadline>
              <ImageTeaserText>{article.teaserText}</ImageTeaserText>
            </ImageTeaser>
          </Link>
        ))}
      </div>
    </div>
  );
}
