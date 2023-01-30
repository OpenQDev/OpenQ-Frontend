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

  // GitHub colors for languages
  const languageColors = {
    JavaScript: 'bg-[#f1e05a]',
    TypeScript: 'bg-[#2b7489]',
    HTML: 'bg-[#e34c26]',
    CSS: 'bg-[#563d7c]',
    Python: 'bg-[#3572A5]',
    Java: 'bg-[#b07219]',
    PHP: 'bg-[#4F5D95]',
    C: 'bg-[#555555]',
    Go: 'bg-[#00ADD8]',
    Ruby: 'bg-[#701516]',
    Shell: 'bg-[#89e051]',
    Swift: 'bg-[#ffac45]',
    Starlark: 'bg-[#76d275]',
    Cython: 'bg-[#fedf5b]',
    Dockerfile: 'bg-[#384d54]',
    'C#': 'bg-[#178600]',
    'C++': 'bg-[#f34b7d]',
    'Objective-C': 'bg-[#438eff]',
    'Objective-C++': 'bg-[#6866fb]',
    Batchfile: 'bg-[#C1F12E]',
    CMake: 'bg-[#DA3434]',
    XSLT: 'bg-[#EB8CEB]',
    Awk: 'bg-[#c30f0f]',
    PowerShell: 'bg-[#012456]',
  };

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
      <div className='border border-dark-1 rounded-sm p-5 bg-dark-3 flex space-x-5 overflow-x-auto custom-scrollbar custom-scrollbar-horizontal snap-x snap-mandatory'>
        {issues.map((issue) => (
          <Link key={issue.id} href={issue.url} target='_blank'>
            <Card className='!w-96'>
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
                <div className='flex items-center mr-3'>
                  <span
                    className={`inline-block w-3 h-3 mr-1 rounded-full ${
                      languageColors[issue.repo.language] || 'bg-gray-300'
                    }`}
                  />
                  {issue.repo.language}
                </div>
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
