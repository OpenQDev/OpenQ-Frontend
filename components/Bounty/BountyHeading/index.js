// Third Party
import React, { useContext } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
// Custom
import MintBountyButton from '../../MintBounty/MintBountyButton';
import StoreContext from '../../../store/Store/StoreContext';
import useDisplayValue from '../../../hooks/useDisplayValue';
import RefreshBounty from './RefreshBounty';
import { getBountyMarker } from '../../../services/utils/lib';
import ClaimButton from '../../Claim/ClaimPage/ClaimButton';
import { checkClaimable } from '../../../services/utils/lib';
import useWeb3 from '../../../hooks/useWeb3';

const BountyHeading = ({
  bounty,
  refreshGithubBounty,
  refreshBounty,
  setInternalMenu,
  internalMenu,
  split,
  claimReqsCompleted,
}) => {
  const [appState] = useContext(StoreContext);
  const { account } = useWeb3();
  const githubId = appState.accountData.github;
  const marker = getBountyMarker(bounty, appState.openQClient, githubId);
  const totalPrice = useDisplayValue(bounty, appState.utils.formatter.format);
  const { status } = checkClaimable(bounty, appState.accountData?.github, appState.openQClient);
  const claimable = status === 'Claimable';
  console.log(claimReqsCompleted);

  return (
    <div className='sm:px-8 px-4 w-full max-w-[1200px] pb-2'>
      <div className='pt-6 pb-2 w-full flex flex-wrap'>
        <h1 className='sm:text-[32px] text-xl flex-1 leading-tight min-w-[240px] pr-20'>
          <span className='text-primary'>{bounty.title} </span>
          {bounty.url ? (
            <Link href={bounty.url} rel='noopener norefferer' target='_blank'>
              <span className='text-link-colour cursor-pointer font-light hover:underline'>#{bounty.number}</span>
            </Link>
          ) : (
            <div>#{bounty.number}</div>
          )}
        </h1>
        <div className='flex flex-row flex-wrap justify-start justify-items-start gap-3 self-center items-center py-2'>
          <RefreshBounty refreshGithubBounty={refreshGithubBounty} bounty={bounty} />
          {bounty && bounty?.issuer?.id && ethers.utils.getAddress(bounty.issuer.id) == account && (
            <MintBountyButton types={['0', '1', '2', '3']} styles={'h-8'} />
          )}
          {claimable && (
            <ClaimButton
              bounty={bounty}
              tooltipStyle={'-right-2'}
              refreshBounty={refreshBounty}
              setInternalMenu={setInternalMenu}
              internalMenu={internalMenu}
              claimable={claimReqsCompleted}
              split={split}
              bountyHeading={true}
            />
          )}
        </div>
      </div>
      <div className='w-full flex flex-wrap justify-between pb-4 border-b border-web-gray'>
        <div className={`${marker.colour} py-2 font-semibold rounded-full px-4 flex gap-1  w-fit`}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16' className={`fill-white`}>
            <path d='M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
            <path
              fillRule='evenodd'
              d='M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z'
            ></path>
          </svg>

          <span className='leading-none'>{marker.status}</span>
        </div>
        <>
          {totalPrice?.displayValue ? (
            <div className='flex items-center gap-2'>
              <span className='leading-loose text-lg font-semibold text-primary'>
                {totalPrice.valueTypeFull} {totalPrice.displayValue}
              </span>
              {totalPrice.valueType == 'TVL' && totalPrice.value > 0 && (
                <div className={'border-green bg-green-inside text-sm px-2 border rounded-full h-min'}>
                  Fully Funded
                </div>
              )}
              {totalPrice.valueType == 'Budget' && (
                <div className={'bg-info border-2 border-info-strong text-sm px-2 border rounded-full h-6'}>
                  Insolvent
                </div>
              )}
            </div>
          ) : null}
        </>
      </div>
    </div>
  );
};
export default BountyHeading;
