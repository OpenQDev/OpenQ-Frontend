import React from 'react';

import Image from 'next/image';
import { RepoIcon } from '@primer/octicons-react';
import { shortenString } from '../../services/utils/lib';

const ShowCaseCard = ({ item, setSingleSubmission }) => {
  const pr = item;
  const firstImageUrlFromPrBodyText = (prBodyText) => {
    const regex = /!\[image]\((.*?)\)/g;
    const matches = prBodyText.match(regex);
    let finalMatch = null;
    if (matches && matches.length > 0) {
      for (let match of matches) {
        if (match.includes('https://user-images.githubusercontent.com') && !finalMatch) {
          finalMatch = match.replace('![image]', '').replace('(', '').replace(')', '');
        }
      }
    }
    return finalMatch;
  };
  const firstSentenceFromPrBodyText = (prBodyText) => {
    const regex = /(.*)\./g;
    const matches = prBodyText.match(regex);
    let finalMatch = null;
    if (matches && matches.length > 0) {
      finalMatch = matches[0].replace('.', '');
    }
    return finalMatch;
  };
  const sentence = firstSentenceFromPrBodyText(pr.body);
  const firstGithubRepoLinkFromPrBody = (prBodyText) => {
    const regex = /https:\/\/github.com\/(.*?)\)/g;
    const matches = prBodyText.match(regex);
    let finalMatch = null;
    if (matches && matches.length > 0) {
      finalMatch = matches[0].replace(')', '');
    }
    return finalMatch;
  };
  const image = firstImageUrlFromPrBodyText(pr.body);
  const link = firstGithubRepoLinkFromPrBody(pr.body);
  const repoNameFromLink = (link) => {
    if (!link) return null;
    const regex = /https:\/\/github.com\/[^/]*\/([^/]*)/g;
    const matches = link.match(regex);
    let finalMatch = null;
    if (matches && matches.length > 0) {
      finalMatch = matches[0].replace(regex, '$1').replace('', '');
    }

    return finalMatch;
  };
  const repoName = repoNameFromLink(link);
  return (
    <>
      <div className={`min-w-[260px] w-60 flex flex-col border rounded-sm border-border-gray`}>
        <div className='flex rounded-sm justify-start gap-2 justify-content-center text-left content-center  items-center px-4 bg-nav-bg py-4'>
          <RepoIcon className='fill-muted' />{' '}
          {repoName ? (
            <button
              onClick={() => setSingleSubmission(item)}
              className='font-semibold text-link-colour hover:underline text-left '
            >
              <span>{shortenString(repoName, 20)}</span>
            </button>
          ) : (
            shortenString(pr.title, 18)
          )}
        </div>
        {image && <Image width={300} height={300} src={image} />}
        <div className='note p-4'>{sentence}.</div>
      </div>
    </>
  );
};
export default ShowCaseCard;
