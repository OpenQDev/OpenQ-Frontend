// Third party
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StoreContext from '../../store/Store/StoreContext';
import starOrganization from './starOrganization';
import useWeb3 from '../../hooks/useWeb3';

const HorizontalOrganizationCard = ({ organization }) => {
  const context = useContext(StoreContext);
  const { safe } = useWeb3();
  const [appState] = context;
  const { id } = appState.accountData;
  const alreadyStarred = organization?.starringUsers?.nodes?.some((user) => user.id === id);
  const [starred, setStarred] = useState(alreadyStarred);
  useEffect(() => {
    setStarred(alreadyStarred);
  }, [alreadyStarred]);
  const [starredDisabled, setStarredDisabled] = useState();
  const [orgBounties, setOrgBounties] = useState([]);

  useEffect(() => {
    const fetchBountiesData = async () => {
      if (organization?.bounties) {
        const filteredBounties = organization.bounties.nodes.filter(
          (contract) => !contract.blacklisted && !contract.closed
        );
        const bountyAddresses = filteredBounties.map((bounty) => bounty.address.toLowerCase());
        const bountyIds = filteredBounties.map((bounty) => bounty.bountyId);
        const githubIssues = await appState.githubRepository.getLeanIssueData(bountyIds);
        const subgraphBounties = await appState.openQSubgraphClient.getBountiesByContractAddresses(bountyAddresses);
        const combinedBounties = await appState.utils.combineBounties(subgraphBounties, githubIssues, filteredBounties);
        const budgetedOrFundedBounties = combinedBounties.filter(
          (bounty) =>
            ((bounty.fundingGoalVolume && bounty.fundingGoalVolume !== '0') || bounty.bountyTokenBalances?.length) &&
            !bounty.closed
        );
        setOrgBounties(budgetedOrFundedBounties);
      } else if (organization) {
        setOrgBounties(organization.bountiesCreated);
      }
    };
    fetchBountiesData();
  }, [organization.bountiesCreated]);
  const handleStar = () => {
    starOrganization(organization.id, starred, setStarred, setStarredDisabled, context);
  };
  // Render
  return (
    <div className='grid grid-cols-[64px_1fr_73px] gap-x-2 sm:gap-x-4 h-[118px] content-center mt-0 border-b border-web-gray py-6'>
      <div className='rounded-sm self-center overflow-hidden h-16'>
        <Image src={organization.avatarUrl} width='64' height='64' alt='avatar' />
      </div>
      <div>
        <h2 className='text-xl mt-1 leading-tight text-primary hover:text-link-colour cursor-pointer'>
          <Link href={`/organization/${organization.login}`}>
            <span> {organization.name || organization.login}</span>
          </Link>
        </h2>
        <div className='flex gap-4'>
          <div className='mt-1 text text-sm leading-normal text-muted truncate'>
            {organization.starringUsers.nodes?.length || 0} star
            {organization.starringUsers.nodes?.length !== 1 && 's'}
          </div>
          <div className='mt-1 text text-sm leading-normal text-muted truncate'>
            {orgBounties.length} {orgBounties.length !== 1 ? 'contracts' : 'contract'}
          </div>
        </div>
      </div>
      {!safe && (
        <button
          onClick={handleStar}
          disabled={starredDisabled}
          className='hidden xs:flex items-center text-xs  bg-inactive-gray leading-5 h-7 px-3 py-[3px] hover:bg-active-gray rounded-sm border hover:border-border-active border-border-gray'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`stroke-muted inline-block mr-2 ${starred ? 'fill-muted' : 'fill-transparent'}`}
            height='16'
            viewBox='0 0 24 24'
            stroke='#4C535B'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
            />
          </svg>
          <span className=''>Star</span>
        </button>
      )}
    </div>
  );
};

export default HorizontalOrganizationCard;
