import React, { useState } from 'react';
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
import { useIssues } from '../../store/Store/GoodFirstIssuesProvider';

export default function GoodFirstIssues() {
  const issues = useIssues();
  const [imageError, setImageError] = useState(false);

  const tenRandomIssuesWithUniqueRepos = issues
    ?.sort(() => Math.random() - 0.5)
    .filter((issue, index, self) => self.findIndex((t) => t.repository.name === issue.repository.name) === index)
    .slice(0, 10);

  return (
    <div className='w-full pt-12 lg:pt-40'>
      <div className='text-center mb-10'>
        <h1 className='mx-auto text-3xl lg:text-6xl'>Contribute to Open-Source in web3.</h1>
        <h3 className='text-xl text-zinc-400 mt-4 lg:text-3xl'>Find good first issues.</h3>
        <Link href='/good-first-issues'>
          <FancyButton className='mt-4 mx-auto'>
            Find more
            <ChevronRightIcon className='ml-2 w-5 h-5' />
          </FancyButton>
        </Link>
      </div>
      <div className='flex sm:border sm:border-dark-1 sm:rounded-sm pb-2 sm:p-5 sm:bg-dark-3 space-x-5 overflow-x-auto custom-scrollbar custom-scrollbar-horizontal'>
        {tenRandomIssuesWithUniqueRepos.map((issue) => (
          <Link key={issue.id} href={issue.url} target='_blank' className='min-w-full max-w-[24rem] sm:min-w-[24rem]'>
            <Card>
              <CardHeader>
                {!imageError && issue.repository.owner.avatarUrl && (
                  <Image
                    src={issue.repository.owner.avatarUrl}
                    alt='OpenQ'
                    width={27}
                    height={27}
                    className='mr-2 rounded-full'
                    onError={() => setImageError(true)}
                  />
                )}
                <div className='pr-3 mr-auto text-link-colour font-bold whitespace-nowrap'>{issue.repository.name}</div>
                <StarButton count={issue.repository.stars} />
              </CardHeader>
              <CardBody>
                <div className='text-xs text-gray-400 truncate'>
                  <IssueOpenedIcon className='text-green-400 mr-2' />
                  {issue.title}
                </div>
                <div className='flex space-x-2 mt-3'>
                  {issue.labels.nodes.map((label) => (
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
                <RepoLanguage language={issue.repository.languages.nodes[0] || null} />
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
