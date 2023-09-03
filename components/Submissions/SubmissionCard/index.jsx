import React, { useContext } from 'react';
import SubmissionCardAdmin from '../SubmissionCardAdmin';
import Link from 'next/link';
import Image from 'next/image';
import SubmissionWinner from '../SubmissionWinner';
import useWeb3 from '../../../hooks/useWeb3';
import StoreContext from '../../../store/Store/StoreContext';
import WinnerSelectAmounts from '../WinnerSelectAmounts';

const SubmissionCard = ({ submission, bounty, refreshBounty }) => {
  console.log(submission, 'my submissions');
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { account } = useWeb3();
  const admin = bounty && bounty?.issuer?.id === account?.toLowerCase();
  const firstUser = submission.users.nodes[0];
  const tierWon = bounty?.tierWinners?.indexOf(firstUser.github);
  const submissionTime = Math.floor(new Date(submission.createdAt).getTime() / 1000);
  const tierClaimed = bounty?.claims?.some((claim) => claim.tier == tierWon);

  const classifyTime = (time) => {
    if (time < 3600) {
      return parseInt(time / 60) + ` minute${parseInt(time / 60) > 1 ? 's' : ''} ago`;
    } else if (time < 86400) {
      return parseInt(time / 3600) + ` hour${parseInt(time / 3600) > 1 ? 's' : ''} ago`;
    } else if (time < 604800) {
      return parseInt(time / 86400) + ` day${parseInt(time / 86400) > 1 ? 's' : ''} ago`;
    } else {
      return 'More than a week ago';
    }
  };

  const linkedPrize = tierWon >= 0 && tierWon + 1;

  const bodyTextString = submission.overviewHTML
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const firstSentenceFromPrBodyText = (bodyTextString) => {
    // Split the cleaned text into sentences
    const sentences = bodyTextString.match(/[^\.!\?]+[\.!\?]+/g);

    // Get the first sentence (or first 10 words if there are no sentences)
    return sentences ? sentences.slice(0, 1).join(' ') : bodyTextString.split(' ').slice(0, 100).join(' ');
  };
  const sentence = firstSentenceFromPrBodyText(bodyTextString);

  return (
    <div className={`min-w-[300px] w-60  border rounded-sm border-border-gray bg-menu-bg`}>
      <div
        target='_blank'
        rel='noopener norefferer'
        className={`flex flex-col p-6 items-center text-[0.8rem] tracking-wider placeholder-input-gray outline-none rounded-sm w-full h-120 mb-1`}
      >
        <div className='flex justify-end w-full items-center -mt-2 relative pt-2'></div>
        <div className='pt-2'>
          <div className='w-16 h-16 relative'>
            <Image
              className='rounded-full'
              src={submission?.coverImage}
              placeholder={'blur'}
              blurDataURL={'/diverse/placeholder-px.png'}
              alt='n/a'
              width={64}
              height={64}
              priority={true}
            />
          </div>
        </div>
        <Link href={`/hackathons/${bounty.repoId}/${submission.id}`} className='w-full'>
          <div className='pt-5 text-center cursor-pointer underline w-full font-medium text-xl truncate'>
            {submission.title}
          </div>
        </Link>
        <div className='text-center pt-2 text-gray-400 w-full'>
          By{' '}
          <Link href={`/user/${firstUser.id}`} className='underline cursor-pointer'>
            {firstUser.username}
          </Link>
        </div>
        <div className='text-center btn-default my-2'>{classifyTime(Date.now() / 1000 - submissionTime)}</div>

        <div className='text-center pt-2 text-gray-400 w-full'>
          On {appState.utils.formatDate(parseInt(submission.createdAt) * 1000)}
          {console.log(submission.createdAt, 'submission.createdAt')}
        </div>

        <div className=' pt-2 text-gray-400 h-20 w-full break-word'>
          {sentence}
          {'...'}
        </div>
        <Link href={submission?.url ?? ''} target='_blank' rel='noreferrer'>
          <div className='pt-4 cursor-pointer' id={'github-link'}>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='white'>
              <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
            </svg>
          </div>
        </Link>
      </div>
      {!linkedPrize ? (
        admin && <SubmissionCardAdmin refreshBounty={refreshBounty} submission={submission} bounty={bounty} />
      ) : (
        <>
          <SubmissionWinner linkedPrize={linkedPrize} bounty={bounty} />
          {bounty?.creatingUser?.id === accountData.id && (
            <WinnerSelectAmounts
              submission={submission}
              disabled={false}
              bounty={bounty}
              refreshBounty={refreshBounty}
              isRemove={true}
              tierClaimed={tierClaimed}
              prize={{ index: tierWon, payout: bounty.payoutSchedule[tierWon] }}
            />
          )}
        </>
      )}
    </div>
  );
};
export default SubmissionCard;
