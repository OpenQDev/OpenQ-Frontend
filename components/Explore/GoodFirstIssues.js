import React from 'react';
import { ChevronRightIcon } from '@primer/octicons-react';
import Image from 'next/image';
import FancyButton from './FancyButton';
import Card from './Card/Card';
import CardBody from './Card/CardBody';
import CardFooter from './Card/CardFooter';
import CardHeader from './Card/CardHeader';
import StarButton from './StarButton';

export default function GoodFirstIssues() {
  return (
    <div className='my-24 w-full'>
      <div className='text-center mb-10'>
        <h1 className='text-center w-full'>Contribute to Open-Source in web3.</h1>
        <h3 className='text-3xl text-zinc-400 mt-4'>Find good first issues.</h3>
        <FancyButton className='mt-4'>
          Find more
          <ChevronRightIcon className='ml-2 w-5 h-5' />
        </FancyButton>
      </div>
      <div className='border border-dark-1 rounded-lg p-5 bg-dark-3 flex space-x-5 overflow-x-auto custom-scrollbar custom-scrollbar-horizontal snap-x snap-mandatory'>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Image
                src='https://avatars.githubusercontent.com/u/77402538?v=4'
                alt='OpenQ'
                width={24}
                height={24}
                className='mr-2 rounded-full'
              />
              <div className='pr-3 mr-auto'>OpenQ</div>
              <StarButton />
            </CardHeader>
            <CardBody>asd</CardBody>
            <CardFooter>asd</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
