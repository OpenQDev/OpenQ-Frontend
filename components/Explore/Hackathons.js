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

export default function ExploreHackathons({ fullContests }) {
  const handleStar = () => {
    return null;
  };
  return (
    <div className='sm:grid sm:grid-cols-2 sm:gap-6 md:gap-12 lg:gap-18 xl:gap-24 w-full pt-6 lg:pt-10'>
      <Link
        href='https://docs.openq.dev/hackathon-organizer/create-hackathon-repository'
        target='_blank'
        rel='noopener noreferrer'
      >
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
          <Link href='/hackathons'>
            <FancyButton>
              <span className='hidden lg:inline'>Explore </span>more
              <ChevronRightIcon className='ml-2 w-5 h-5' />
            </FancyButton>
          </Link>
        </h2>
        <FlexScrollContainer>
          <div className='flex space-x-5 sm:flex-col sm:space-x-0 sm:space-y-5'>
            {fullContests.map((contest) => (
              <Link key={contest.id} href={`/repo/${contest?.owner?.login}/${contest.name}`}>
                <Card className='w-80 sm:w-full h-60 sm:h-fit'>
                  <CardHeader className='w-80 sm:w-full h-12 sm:h-fit'>
                    {contest?.owner?.avatarUrl && (
                      <Image
                        src={contest?.owner?.avatarUrl}
                        width={24}
                        height={24}
                        className='mr-2 rounded-full'
                        alt='avatar'
                      />
                    )}
                    <div className='mr-auto'>{contest.name}</div>
                    <div className='hidden'>
                      <StarButton onClick={() => handleStar(contest)} />
                    </div>
                  </CardHeader>
                  <CardBody
                    className={`w-80 sm:w-full ${
                      contest.languages.nodes?.length > 0 ? 'h-36' : 'h-48'
                    } py-2 sm:py-4 sm:h-fit overflow-y-auto`}
                  >
                    {contest.description}
                  </CardBody>
                  {contest.languages.nodes?.length > 0 && (
                    <CardFooter className={'w-80 sm:w-full py-0 sm:py-4 h-12 sm:h-fit'}>
                      <div className='flex w-full justify-end'>
                        {contest.languages.nodes
                          .filter((_, i) => i < 3)
                          .map((language) => (
                            <RepoLanguage key={language.name} language={language} />
                          ))}
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </FlexScrollContainer>
      </div>
    </div>
  );
}
