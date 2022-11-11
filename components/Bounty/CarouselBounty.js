import React, { useContext, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import Image from 'next/legacy/image';
import ToolTipNew from '../Utils/ToolTipNew';
import Link from 'next/link';
import { PersonAddIcon, PersonIcon, PeopleIcon } from '@primer/octicons-react';
import LabelsList from '../Bounty/LabelsList';
import useWeb3 from '../../hooks/useWeb3';
import { ethers } from 'ethers';

const CarouselBounty = ({ bounty }) => {
  const [appState] = useContext(StoreContext);
  const { safe } = useWeb3();
  const createBudget = (bounty) => {
    return bounty.fundingGoalTokenAddress
      ? {
          tokenAddress: bounty.fundingGoalTokenAddress,
          volume: bounty.fundingGoalVolume,
        }
      : null;
  };
  const budgetObj = useMemo(() => createBudget(bounty), [bounty]);
  const [budgetValue] = useGetTokenValues(budgetObj);
  const budget = budgetValue?.total;

  const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances);
  const [payoutValues] = useGetTokenValues(bounty?.payouts);
  const price = tokenValues?.total;

  const getPayoutScheduleBalance = (bounty) => {
    if (bounty.bountyType === '3') {
      const totalPayoutsScheduled = bounty.payoutSchedule.reduce((acc, payout) => {
        return ethers.BigNumber.from(acc).add(ethers.BigNumber.from(payout));
      });
      return {
        volume: totalPayoutsScheduled.toString(),
        tokenAddress: bounty.payoutTokenAddress,
      };
    }
  };

  const payoutScheduledBalance = useMemo(() => getPayoutScheduleBalance(bounty), [bounty]);
  const [payoutScheduledValues] = useGetTokenValues(payoutScheduledBalance);

  return (
    <div className='border-web-gray bg-dark-mode p-4 gap-2 border rounded-sm flex mb-1'>
      <Link
        target={safe ? '_self' : '_blank'}
        rel='noopener noreferrer'
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/contract/${bounty.bountyId}/${bounty.bountyAddress}`}
        className=''
        legacyBehavior
      >
        <div className='w-64'>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-normal truncate'>
              {bounty.owner.toLowerCase()}/{bounty.repoName.toLowerCase()}
            </p>
            <div className='pt-1'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill={bounty?.STATUS === 'CLOSED' ? '#F0431D' : '#15FB31'}
                viewBox='0 0 16 16'
                width='19'
                height='19'
              >
                <path d='M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
                <path
                  fillRule='evenodd'
                  d='M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z'
                ></path>
              </svg>
            </div>
          </div>
          <h4 className='font-semibold truncate leading-tight mb-1 pt-1'>{bounty.title.toLowerCase()}</h4>
          <div className='pt-1'>
            <LabelsList bounty={bounty} isLimited={true} />
          </div>
          <div className='pt-10'>
            <div className='flex flex-row justify-between'>
              <div></div>
              {bounty.bountyType === '0' ? (
                <span className='font-semibold flex flex-end items-center content-center gap-1 w-max'>
                  <PersonIcon />
                  <div className='whitespace-nowrap'>Fixed Price</div>
                </span>
              ) : bounty.bountyType === '1' ? (
                <span className='font-semibold flex flex-end items-center content-center gap-1 w-max'>
                  <PersonAddIcon />
                  <div className='whitespace-nowrap'>Split Price</div>
                </span>
              ) : (
                (bounty.bountyType === '2' || bounty.bountyType === '3') && (
                  <span className='font-semibold flex flex-end items-center content-center gap-1 w-max'>
                    <PeopleIcon />
                    <div className='whitespace-nowrap'>Contest</div>
                  </span>
                )
              )}
            </div>
            <div className='pt-1'>
              <div className='flex flex-row justify-between items-center'>
                <div className='pt-1 items-center gap-4 text-muted font-semibold'>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className={'stroke-muted inline-block mr-1 -mt-1 fill-muted'}
                      viewBox='0 0 16 16'
                      width='16'
                      height='16'
                    >
                      <path d='M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z'></path>
                    </svg>
                    <span>{bounty.watchingCount}</span>
                  </span>
                </div>
                <div className=''>
                  {price > budget ? (
                    <div className='flex flex-row space-x-1 items-center'>
                      <div className='pr-2 pt-1'>
                        <Image src='/crypto-logos/ETH-COLORED.png' alt='avatarUrl' width='12' height='20' />
                      </div>

                      {bounty.status !== '0' ? (
                        <>
                          <div className='font-semibold '>TVC</div>
                          <div className=''>
                            {appState.utils.formatter.format(bounty.tvc || payoutValues.total || 0)}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='font-semibold '>TVL</div>
                          <div className=''>{appState.utils.formatter.format(price)}</div>
                        </>
                      )}
                    </div>
                  ) : budget > 0 || payoutScheduledValues?.total > 0 ? (
                    <>
                      <div className='flex flex-row space-x-1 items-center'>
                        <div className='pr-2 pt-1'>
                          <Image src='/crypto-logos/ETH.svg' alt='avatarUrl' width='12' height='20' />
                        </div>

                        <>
                          <div className='font-semibold '>Budget</div>
                          <div className=''>
                            {appState.utils.formatter.format(payoutScheduledValues?.total || budget)}
                          </div>
                        </>
                      </div>
                    </>
                  ) : (
                    <div className='flex gap-2'>
                      <div className='flex flex-row space-x-1 items-center'>
                        <div className='pr-2 pt-1'>
                          <Image src='/crypto-logos/ETH.svg' alt='avatarUrl' width='12' height='20' />
                        </div>

                        <>
                          <div className='font-semibold '>Budget</div>
                        </>
                      </div>
                      <div className='flex flex-row space-x-1 items-center'>
                        <ToolTipNew
                          innerStyles={'whitespace-normal w-60'}
                          toolTipText={'No budget has been set for this contract'}
                        >
                          <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                            ?
                          </div>
                        </ToolTipNew>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default CarouselBounty;
