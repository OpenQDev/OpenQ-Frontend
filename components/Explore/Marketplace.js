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
import RepoLanguage from './RepoLanguage';

export default function ExploreMarketplace({ fullBounties }) {
  return (
    <div className='sm:grid sm:grid-cols-2 sm:gap-6 md:gap-12 xl:gap-24 w-full pt-12 lg:pt-24'>
      <Link href='/fixed-price' className='sm:order-2'>
        <ImageTeaser imageSrc='/explore/teaser2.png' textPosition='top'>
          <ImageTeaserLink>
            Learn more
            <ChevronRightIcon className='ml-2 w-5 h-5' />
          </ImageTeaserLink>
          <ImageTeaserHeadline>A permissionless marketplace for devs.</ImageTeaserHeadline>
          <ImageTeaserText>
            Never worry again about not getting paid in time. Every ticket that has an escrow assinged, is ensuring
            payment after the job is completed.
          </ImageTeaserText>
        </ImageTeaser>
      </Link>
      <div className='flex flex-col sm:order-1 mt-10 sm:mt-0'>
        <h2 className='flex items-center justify-between mb-1 md:mb-3'>
          <span>Marketplace</span>
          <Link href='/fixed-price'>
            <FancyButton>
              <span className='hidden lg:inline'>Explore </span>more
              <ChevronRightIcon className='ml-2 w-5 h-5' />
            </FancyButton>
          </Link>
        </h2>
        <FlexScrollContainer>
          <div className='flex space-x-5 sm:flex-col sm:space-x-0 sm:space-y-5'>
            {fullBounties.map((bounty) => (
              <Card key={bounty.id} className='min-w-full'>
                <CardHeader>
                  <Image
                    src='https://avatars.githubusercontent.com/u/77402538?v=4'
                    alt='OpenQ'
                    width={24}
                    height={24}
                    className='mr-2 rounded-full'
                  />
                  <div className='mr-auto'>{bounty.repoName}</div>
                  <StarButton />
                </CardHeader>
                <CardBody>{bounty.title}</CardBody>
                <CardFooter>
                  {bounty.languages.map((language) => (
                    <RepoLanguage key={language.name} language={language.name} color={language.color} />
                  ))}
                  {bounty.assignees.length ? (
                    <div className='text-xs text-gray-400'>Assigned to {bounty.assignees.length}</div>
                  ) : (
                    <div className='text-xs text-gray-400'>No one assigned</div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </FlexScrollContainer>
      </div>
    </div>
  );
}
