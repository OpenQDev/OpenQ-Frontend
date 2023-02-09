import React from 'react';
import { ChevronRightIcon } from '@primer/octicons-react';
import Link from 'next/link';
import Image from 'next/image';
import FancyButton from './FancyButton';
import Card from './Card/Card';
import CardBody from './Card/CardBody';
import CardFooter from './Card/CardFooter';
import CardHeader from './Card/CardHeader';
import ImageTeaser from './ImageTeaser/ImageTeaser';
import ImageTeaserHeadline from './ImageTeaser/ImageTeaserHeadline';
import ImageTeaserLink from './ImageTeaser/ImageTeaserLink';
import ImageTeaserText from './ImageTeaser/ImageTeaserText';
import StarButton from './StarButton';
import FlexScrollContainer from './FlexScrollContainer';
import RepoLanguage from './RepoLanguage';

export default function ExploreHackathons({ fullBounties }) {
  return (
    <div className='sm:grid sm:grid-cols-2 sm:gap-6 md:gap-12 lg:gap-18 xl:gap-24 w-full pt-12 lg:pt-32'>
      <Link href='/'>
        <ImageTeaser imageSrc='/explore/teaser1.png'>
          <ImageTeaserLink>
            Learn more
            <ChevronRightIcon className='ml-2 w-5 h-5' />
          </ImageTeaserLink>
          <ImageTeaserHeadline>The home for web3 hackathons.</ImageTeaserHeadline>
          <ImageTeaserText>
            Learn new skills, build your online reputation & get paid before the hackathon ends.
          </ImageTeaserText>
        </ImageTeaser>
      </Link>
      <div className='flex flex-col mt-10 sm:mt-0'>
        <h2 className='flex items-center justify-between mb-1 md:mb-3'>
          <span>
            Hackathons<span className='hidden xl:inline'> for you</span>
          </span>
          <FancyButton>
            <span className='hidden lg:inline'>Explore </span>more
            <ChevronRightIcon className='ml-2 w-5 h-5' />
          </FancyButton>
        </h2>
        <FlexScrollContainer>
          <div className='flex space-x-5 sm:flex-col sm:space-x-0 sm:space-y-5'>
            {fullBounties.map((bounty) => (
              <Card key={bounty.id} className="min-w-full">
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
                <CardBody>
                  {bounty.title}
                  {bounty.assignees.length ? (
                    <div className='text-xs text-gray-400'>Assigned to {bounty.assignees.length}</div>
                  ) : (
                    <div className='text-xs whitespace-nowrap text-gray-400 shrink'>No one assigned</div>
                  )}
                </CardBody>
                <CardFooter>
                  {bounty.languages
                    .filter((_, i) => i < 3)
                    .map((language) => (
                      <RepoLanguage key={language.name} language={language.name} color={language.color} />
                    ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        </FlexScrollContainer>
      </div>
    </div>
  );
}
