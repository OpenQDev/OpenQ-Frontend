import React from 'react';

import Image from 'next/image';
import { RepoIcon } from '@primer/octicons-react';
import { shortenString } from '../../services/utils/lib';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ShowCaseCard = ({ item, setSingleSubmission }) => {
  const router = useRouter();
  const { id } = router.query;

  const submission = item;
  const bodyTextString = submission.overviewHTML
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const firstSentenceFromPrBodyText = (bodyTextString) => {
    // Split the cleaned text into sentences
    const sentences = bodyTextString.match(/[^\.!\?]+[\.!\?]+/g);

    // Get the first sentence (or first 10 words if there are no sentences)
    return sentences ? sentences[0] : bodyTextString.split(' ').slice(0, 10).join(' ');
  };
  console.log(submission);
  const sentence = firstSentenceFromPrBodyText(bodyTextString);
  const firstGithubRepoLinkFromPrBody = (prBodyText) => {
    const regex = /https:\/\/github.com\/(.*?)\)/g;
    const matches = prBodyText.match(regex);
    let finalMatch = null;
    if (matches && matches.length > 0) {
      finalMatch = matches[0].replace(')', '');
    }
    return finalMatch;
  };
  const link = firstGithubRepoLinkFromPrBody(bodyTextString);
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
    <Link href={`/hackathons/${id}/submission/${item.id}`}>
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
            shortenString(submission.title, 18)
          )}
        </div>
        {false && <Image width={300} height={300} src={''} />}
        <div className='note p-4'>{sentence}.</div>
      </div>
    </Link>
  );
};
export default ShowCaseCard;
