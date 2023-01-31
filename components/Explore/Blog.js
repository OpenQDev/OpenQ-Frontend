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
      title: 'Web 2.0 DAO — Part I',
      url: 'https://medium.com/openqdev/web-2-0-dao-part-i-4cec53dd0ec3',
      imageSrc: '/explore/blog-2.png',
      teaserText: 'How I’d (Fail) To Build a DAO in 2010',
    },
    {
      title: 'Web 2.0 DAO — Part II',
      url: 'https://medium.com/openqdev/web-2-0-dao-part-ii-6ac736d899d6',
      imageSrc: '/explore/blog-3.png',
      teaserText: 'How I’d (Successfully) Build a DAO in 2022',
    },
    {
      title: 'The Legend of the Code Vending Machine',
      url: 'https://medium.com/openqdev/the-legend-of-the-code-vending-machine-b30d3d573c4f',
      imageSrc: '/explore/blog-4.png',
      teaserText: 'Why no code is still a no go',
    },
  ]
  return (
    <div className='my-24 w-full'>
      <h1 className='text-center mb-10 mx-auto'>What we are thinking about</h1>
      <div className='border border-dark-1 rounded-lg p-5 bg-dark-3 flex space-x-5 overflow-x-auto custom-scrollbar custom-scrollbar-horizontal snap-x snap-mandatory'>
        {articles.map((article) => (
          <Link key={article.title} href={article.url}>
            <ImageTeaser imageSrc={article.imageSrc}>
              <ImageTeaserLink>
                Learn more
                <ChevronRightIcon className='ml-2 w-5 h-5' />
              </ImageTeaserLink>
              <ImageTeaserHeadline>{article.title}</ImageTeaserHeadline>
              <ImageTeaserText>
                {article.teaserText}
              </ImageTeaserText>
            </ImageTeaser>
          </Link>
        ))}
      </div>
    </div>
  );
}
