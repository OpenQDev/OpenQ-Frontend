import React, { useEffect, useState } from 'react';
import Gun from 'gun/gun';
import { ChevronRightIcon } from '@primer/octicons-react';
import Image from 'next/image';
import FancyButton from './FancyButton';
import Card from './Card/Card';
import CardBody from './Card/CardBody';
import CardFooter from './Card/CardFooter';
import CardHeader from './Card/CardHeader';
import StarButton from './StarButton';

import reposWhitelist from './reposWhitelist.json';

const gun = new Gun({
  peers: ['http://192.168.178.29:4200/gun', 'https://phorum-relay.mktcode.uber.space/gun'],
});

export default function GoodFirstIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    reposWhitelist.forEach((ownerAndRepo) => {
      gun.get(ownerAndRepo).once((repo) => {
        try {
          const repoIssues = JSON.parse(repo.issuesJson);
          setIssues((currentIssues) => {
            const issuesWithDuplicates = [...currentIssues, ...repoIssues];
            const uniqueIssues = issuesWithDuplicates.filter((issue, index, self) => {
              return self.findIndex((i) => i.id === issue.id) === index;
            });
            return uniqueIssues;
          });
        } catch (e) {
          console.log('error parsing issues coming from gun', e, repo.issuesJson);
        }
      });
    });
  }, []);

  return (
    <div className='my-24 w-full'>
      <div className='text-center mb-10'>
        <h1 className='mx-auto'>Contribute to Open-Source in web3.</h1>
        <h3 className='text-3xl text-zinc-400 mt-4'>Find good first issues.</h3>
        <FancyButton className='mt-4 mx-auto'>
          Find more
          <ChevronRightIcon className='ml-2 w-5 h-5' />
        </FancyButton>
      </div>
      <div className='border border-dark-1 rounded-lg p-5 bg-dark-3 flex space-x-5 overflow-x-auto custom-scrollbar custom-scrollbar-horizontal snap-x snap-mandatory'>
        {issues.map((issue) => (
          <Card key={issue.id}>
            <CardHeader>
              <Image
                src='https://avatars.githubusercontent.com/u/77402538?v=4'
                alt='OpenQ'
                width={24}
                height={24}
                className='mr-2 rounded-full'
              />
              <div className='pr-3 mr-auto'>{issue.title}</div>
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
