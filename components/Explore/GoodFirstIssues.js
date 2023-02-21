import React, { useContext, useEffect, useState } from 'react';
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
import { gun } from '../../lib/Gun';
import StoreContext from '../../store/Store/StoreContext';
import goodFirstIssuesOrgWhitelist from '../../lib/goodFirstIssuesOrgWhitelist.json';

export default function GoodFirstIssues() {
  const [appState] = useContext(StoreContext);
  const [issues, setIssues] = useState([]);
  
  const NUMBER_OF_RANDOMLY_UPDATE_ORGS = 1;

  async function syncOrg(orgName) {
    const githubOrgRepoNames = await appState.githubRepository.fetchOrgRepoNames(orgName);
  
    for (const githubRepoName of githubOrgRepoNames) {
      console.log('Syncing', orgName, githubRepoName);
      const repo = await appState.githubRepository.fetchRepoWithLabeledIssues(
        orgName,
        githubRepoName,
        [ 'good first issue' ]
      );

      repo.issues.nodes.forEach(issue => {
        const updatedIssue = { ...issue };
        updatedIssue.repo = {
          ...repo,
          issues: undefined,
        };
        console.log('goodfirstissues to gun', updatedIssue)
        gun.get('goodfirstissues').get(updatedIssue.id).put(JSON.stringify(updatedIssue));
      });
    }
  }

  useEffect(() => {
    try {
      const shuffledOrgWhitelist = goodFirstIssuesOrgWhitelist.sort(() => 0.5 - Math.random());
      // const shuffledOrgWhitelist = ['OpenQDev']
      for (const orgName of shuffledOrgWhitelist.slice(0, NUMBER_OF_RANDOMLY_UPDATE_ORGS)) {
        syncOrg(orgName);
      }
    } catch (e) {
      console.error('Error syncing org to gun:', e.message);
    }
  }, []);

  gun.get('goodfirstissues').once().map((issue, id) => {
    setIssues(issues => [...issues, JSON.parse(issue)]);
  });
  
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
