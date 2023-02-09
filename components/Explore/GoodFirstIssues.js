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
  peers: ['https://gun.mktcode.uber.space/gun'],
});

export default function GoodFirstIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    reposWhitelist.forEach((ownerAndRepo) => {
      gun.get(ownerAndRepo).once((repo) => {
        if (!repo || !repo.issuesJson) return;
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
    <div className='w-full pt-12 lg:pt-40'>
      <div className='text-center mb-10'>
        <h1 className='mx-auto'>Contribute to Open-Source in web3.</h1>
        <h3 className='text-2xl sm:text-3xl text-zinc-400 mt-4'>Find good first issues.</h3>
        <FancyButton className='mt-4 mx-auto'>
          Find more
          <ChevronRightIcon className='ml-2 w-5 h-5' />
        </FancyButton>
      </div>
      <div className='flex sm:border sm:border-dark-1 sm:rounded-sm pb-2 sm:p-5 sm:bg-dark-3 space-x-5 overflow-x-auto custom-scrollbar custom-scrollbar-horizontal'>
        {issues.map((issue) => (
          <Link key={issue.id} href={issue.url} target='_blank' className='min-w-full max-w-[24rem] sm:min-w-[24rem]'>
            <Card>
              <CardHeader>
                <Image
                  src='https://avatars.githubusercontent.com/u/77402538?v=4'
                  alt='OpenQ'
                  width={27}
                  height={27}
                  className='mr-2 rounded-full'
                />
                <div className='pr-3 mr-auto text-link-colour font-bold whitespace-nowrap'>{issue.repo.name}</div>
                <StarButton count={issue.repo.stars} />
              </CardHeader>
              <CardBody>
                <div className='text-xs text-gray-400 truncate'>
                  <IssueOpenedIcon className='text-green-400 mr-2' />
                  {issue.title}
                </div>
                <div className='flex space-x-2 mt-3'>
                  {issue.labels.map((label) => (
                    <span
                      key={label.id}
                      className='inline-block text-[10px] rounded-full px-2 leading-5 text-white text-opacity-75 whitespace-nowrap'
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
                  <div className='text-xs text-gray-400 whitespace-nowrap'>Assigned to {issue.assignee}</div>
                ) : (
                  <div className='text-xs text-gray-400 whitespace-nowrap'>No one assigned</div>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
