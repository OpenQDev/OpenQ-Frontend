// Third party
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';

// Custom
import { BookIcon, EyeIcon, StarIcon, LinkIcon } from '@primer/octicons-react';
import SubMenu from '../Utils/SubMenu';
import Watching from './WatchingTab/Watching';
import Starred from './StarsTab/Starred';
import StoreContext from '../../store/Store/StoreContext';
import FreelancerDetails from './InvoicingDetailsTab/FreelancerDetails';
import OrgDetails from './InvoicingDetailsTab/OrgDetails';
import UserSocials from './OverviewTab/UserSocials';
import GithubRequirement from '../../components/Claim/ClaimPage/GithubRequirement';
import Skills from './OverviewTab/Skills';
import Subscribe from '../Utils/Subscribe';
import AuthContext from '../../store/AuthStore/AuthContext';
import Username from './OverviewTab/Username';
import KycRequirement from '../Claim/ClaimPage/KycRequirement';

const AboutFreelancer = ({ user, starredOrganizations, watchedBounties, tab }) => {
  const [internalMenu, setInternalMenu] = useState(tab || 'Overview');
  const [appState] = useContext(StoreContext);
  const [watchedFullBounties, setWatchedFullBounties] = useState([]);
  const [githubUser, setGithubUser] = useState();

  const { accountData } = appState;
  const loggedId = accountData?.id;
  const isOwner = loggedId == user.id;
  const [authState] = useContext(AuthContext);
  const { githubId } = authState;

  useEffect(() => {
    if (user.github) {
      const getGithubUser = async () => {
        const githubUser = await appState.githubRepository.fetchUserById(user.github);
        if (githubUser) setGithubUser(githubUser);
      };
      try {
        getGithubUser();
      } catch (err) {
        appState.logger.error(err, accountData.id, 'AboutFreelancer.js');
      }
    }
  }, [githubId, isOwner]);
  // Context
  // State

  useEffect(() => {
    const getWatched = async () => {
      try {
        const watchedBountyAddresses = watchedBounties.map((bounty) => bounty.address.toLowerCase()) || [];
        const subgraphBounties = await appState.openQSubgraphClient.getBountiesByContractAddresses(
          watchedBountyAddresses,
          ['0', '1', '2', '3']
        );
        const githubIds = subgraphBounties.map((bounty) => bounty.bountyId);
        const githubBounties = await appState.githubRepository.getIssueData(githubIds);
        setWatchedFullBounties(
          subgraphBounties.map((bounty, index) => {
            return { ...bounty, ...githubBounties[index] };
          })
        );
      } catch (err) {
        appState.logger.error(err, accountData.id, 'AboutFreelancer.js1');
      }
    };
    if (isOwner) {
      // get watched bounties as soon as we know what the account is.
      getWatched();
    }
  }, [isOwner, watchedBounties]);

  return (
    <>
      <div className='flex flex-col justify-center'>
        <SubMenu
          internalMenu={internalMenu}
          updatePage={setInternalMenu}
          styles='w-full flex flex-wrap sm:flex-row mb-6 sm:mb-0 justify-center lg:justify-start max-w-[900px] mx-auto border-none'
          colour='rust'
          items={[
            { name: 'Overview', Svg: BookIcon },
            ...[starredOrganizations.length ? { name: 'Stars', Svg: StarIcon } : {}],
            ...[isOwner ? { name: 'Watching', Svg: EyeIcon } : {}],
            ...[isOwner ? { name: 'Wallet-to-GitHub', Svg: LinkIcon } : {}],
            ...[isOwner ? { name: '🧍KYC' } : {}],

            ...[isOwner ? { name: '📃Invoicing (Freelancer)' } : {}],
            ...[isOwner ? { name: '📃Invoicing (Org)' } : {}],
          ]}
        />
        <div className='w-full border-b h-px border-web-gray'></div>
        <div className='flex relative max-w-[1440px] w-full mx-auto'>
          <div className='hidden lg:block max-w-[25%] border-web-gray pl-4 xl:left-20 relative left-24'>
            {user ? (
              <div className='flex '>
                <div className='flex items-center content-center relative top-4 xl:-top-4'>
                  <Image src={user.avatarUrl} width={292} height={292} alt={'profile pic'} className='rounded-full' />
                </div>
              </div>
            ) : (
              <div className='float-right '>
                <div className='rounded-full h-72 w-72 xl:-mt-4 relative overflow-hidden'></div>
              </div>
            )}
            {githubUser && (
              <>
                {' '}
                <a href={githubUser.url} className='block hover:underline pt-8 pl-4 text-xl font-semibold'>
                  {githubUser.login}
                </a>
                {githubUser.websiteUrl && (
                  <a className='pl-4 flex gap-2 hover:underline' href={githubUser.websiteUrl}>
                    <svg
                      className='fill-primary top-1 relative'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 16 16'
                      width='16'
                      height='16'
                    >
                      <path
                        fillRule='evenodd'
                        d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'
                      ></path>
                    </svg>

                    <span>{githubUser.websiteUrl}</span>
                  </a>
                )}
              </>
            )}
          </div>

          <div className='flex flex-col flex-1 lg:pl-20 '>
            {internalMenu == 'Overview' && (
              <div className=''>
                <Username user={user} />
                {/* 
               
               TODO associate openq account with ethereum account
               <AboutTitle ensName={ensName} account={account} githubUser={githubUser} />

                <UserHistory organizations={organizations} payouts={payouts} />
                <Balances tokenBalances={payoutTokenBalances} tokenValues={payoutTokenValues} title='Total Payouts' />
                <MiniBountyList payouts={payouts} />*/}

                <UserSocials user={user} />

                <Skills user={user} />
                {isOwner && <Subscribe user={user} />}
              </div>
            )}
            {internalMenu == 'Wallet-to-GitHub' && (
              <div className='flex px-8 justify-between mt-12'>
                <GithubRequirement />
              </div>
            )}
            {internalMenu == '🧍KYC' && (
              <div className='flex px-8 justify-between mt-12'>
                <KycRequirement />
              </div>
            )}
            {internalMenu == 'Stars' && <Starred starredOrganizations={starredOrganizations} />}
            {internalMenu === 'Watching' && isOwner && watchedFullBounties.length > 0 && (
              <Watching watchedBounties={watchedFullBounties} />
            )}
            {internalMenu === '📃Invoicing (Freelancer)' && (
              <>
                <FreelancerDetails emailOnly={true} /> <FreelancerDetails />
              </>
            )}
            {internalMenu === '📃Invoicing (Org)' && <OrgDetails showWatched={isOwner} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutFreelancer;
