import React from 'react';
import { ChevronRightIcon } from '@primer/octicons-react';
import Link from 'next/link';
import Image from 'next/image';
import FancyButton from './FancyButton';
import Card from './Card/Card';
import CardBody from './Card/CardBody';
import CardFooter from './Card/CardFooter';
import CardHeader from './Card/CardHeader';
import FlexScrollContainer from './FlexScrollContainer';
import ImageTeaser from './ImageTeaser/ImageTeaser';
import ImageTeaserHeadline from './ImageTeaser/ImageTeaserHeadline';
import ImageTeaserLink from './ImageTeaser/ImageTeaserLink';
import ImageTeaserText from './ImageTeaser/ImageTeaserText';
import StarButton from './StarButton';

export default function ExploreMarketplace() {
  return (
    <div className='md:grid md:grid-cols-2 md:gap-12 lg:gap-24 w-full mt-8'>
      <Link href='/' className='lg:order-2'>
        <ImageTeaser imageSrc='/explore/teaser2.png' textPosition='top'>
          <ImageTeaserLink>
            Learn more
            <ChevronRightIcon className='ml-2 w-5 h-5' />
          </ImageTeaserLink>
          <ImageTeaserHeadline>A reliable marketplace for devs.</ImageTeaserHeadline>
          <ImageTeaserText>
            Never worry again about not getting paid in time. Every ticket that has an escrow assinged, is ensuring
            payment after the job is completed.
          </ImageTeaserText>
        </ImageTeaser>
      </Link>
      <div className='flex flex-col mt-10 lg:order-1'>
        <h2 className='flex flex-col space-y-3 md:flex-row items-center justify-between mb-3'>
          <span>Marketplace</span>
          <FancyButton>
            Explore more
            <ChevronRightIcon className='ml-2 w-5 h-5' />
          </FancyButton>
        </h2>
        <FlexScrollContainer className='min-h-[360px]'>
          <div className='flex flex-col space-y-5'>
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Image
                    src='https://avatars.githubusercontent.com/u/77402538?v=4'
                    alt='OpenQ'
                    width={24}
                    height={24}
                    className='mr-2 rounded-full'
                  />
                  <div className='mr-auto'>OpenQ</div>
                  <StarButton />
                </CardHeader>
                <CardBody>asd</CardBody>
                <CardFooter>asd</CardFooter>
              </Card>
            ))}
          </div>
        </FlexScrollContainer>
      </div>
    </div>
  );
}
