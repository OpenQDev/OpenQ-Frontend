import React from 'react';
import Link from 'next/link';
import GithubHtmlRenderer from '../../Utils/HtmlReneder';

const ShowCasePage = ({ submission }) => {
  return (
    <div className='w-full px-16'>
      <h1 className='lsm:text-[32px] text-white text-2xl pt-8 pb-4 flex-1 leading-tight min-w-[240px] submission-20'>
        {submission.title}
      </h1>
      <div> by {submission.teamName}</div>
      <div className='gap-y-8 py-8 flex flex-col'>
        <GithubHtmlRenderer className='markdown-body' html={submission.overviewHTML} />

        <GithubHtmlRenderer className='markdown-body' html={submission.problemHTML} />

        <GithubHtmlRenderer className='markdown-body' html={submission.challengesHTML} />

        <GithubHtmlRenderer className='markdown-body' html={submission.technologiesUsedHTML} />
        <div className='markdown-body'>
          <h3>This submission was created for the following bounties.</h3>
          <ul>
            {submission.bounties.nodes.map((bounty) => (
              <li key={bounty.title}>
                <Link href={`/contract/${bounty.bountyId}/${bounty.address}`}>{bounty.title}</Link>
              </li>
            ))}
          </ul>
          <h3>Links</h3>
          <ul>
            {submission.links.map((link) => (
              <li key={link}>
                <Link href={link}>{link}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ShowCasePage;
