import React, { useEffect, useState } from 'react';
import Gun from 'gun/gun';
import { ChevronRightIcon, IssueOpenedIcon } from '@primer/octicons-react';
import Image from 'next/image';
import Link from 'next/link';
import FancyButton from './FancyButton';
import Card from './Card/Card';
import CardBody from './Card/CardBody';
import CardFooter from './Card/CardFooter';
import CardHeader from './Card/CardHeader';
import StarButton from './StarButton';
import RepoLanguage from './RepoLanguage';

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
          repoIssues.forEach((issue) => {
            issue.repo = repo;
          });
          setIssues((currentIssues) => {
            const issuesWithDuplicates = [...currentIssues, ...repoIssues];
            const uniqueIssues = issuesWithDuplicates.filter((issue, index, self) => {
              return self.findIndex((i) => i.id === issue.id) === index;
            });
            return uniqueIssues;
          });
        } catch (e) {
          console.log('error parsing issues coming from gun', e, repo.stars);
        }
      });
    });
  }, []);

  return (
    <div className='w-full'>
      <div className='text-center mb-10'>
        <h1 className='mx-auto'>Contribute to Open-Source in web3.</h1>
        <h3 className='text-3xl text-zinc-400 mt-4'>Find good first issues.</h3>
        <FancyButton className='mt-4 mx-auto'>
          Find more
          <ChevronRightIcon className='ml-2 w-5 h-5' />
        </FancyButton>
      </div>
      <div className='flex flex-col space-y-5 md:space-y-0 md:flex-row md:border md:border-dark-1 md:rounded-sm md:p-5 md:bg-dark-3 md:space-x-5 md:overflow-x-auto md:custom-scrollbar md:custom-scrollbar-horizontal md:snap-x md:snap-mandatory'>
        {issues.map((issue) => (
          <Link key={issue.id} href={issue.url} target='_blank'>
            <Card className='md:!w-96'>
              <CardHeader>
                <Image
                  src='https://avatars.githubusercontent.com/u/77402538?v=4'
                  alt='OpenQ'
                  width={27}
                  height={27}
                  className='mr-2 rounded-full'
                />
                <div className='pr-3 mr-auto text-link-colour font-bold'>{issue.repo.name}</div>
                <StarButton count={issue.repo.stars} />
              </CardHeader>
              <CardBody>
                <div className='text-xs text-gray-400'>
                  <IssueOpenedIcon className='text-green-400 mr-2' />
                  {issue.title}
                </div>
                <div className='flex space-x-2 mt-5 mb-2'>
                  {issue.labels.map((label) => (
                    <span
                      key={label.id}
                      className='inline-block text-[10px] rounded-full px-2 leading-5 text-white text-opacity-75'
                      style={{ backgroundColor: `#${label.color}` }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </CardBody>
              <CardFooter>
                <RepoLanguage language={issue.repo.language} />
                {issue.assignee ? (
                  <div className='text-xs text-gray-400'>Assigned to {issue.assignee}</div>
                ) : (
                  <div className='text-xs text-gray-400'>No one assigned</div>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
