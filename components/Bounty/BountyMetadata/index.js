import React, { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import LabelsList from '../LabelsList';
import CopyBountyAddress from '../CopyBountyAddress';
import StoreContext from '../../../store/Store/StoreContext';
import TokenBalances from '../../TokenBalances/TokenBalances';
import useGetTokenValues from '../../../hooks/useGetTokenValues';
import { ethers } from 'ethers';
import useGetValueFromComposite from '../../../hooks/useGetValueFromComposite';
import { getBountyTypeName } from '../../../services/utils/lib';

const BountyMetadata = ({ bounty, setInternalMenu, split }) => {
  const [appState] = useContext(StoreContext);
  const [fundsNeeded, setFundsNeeded] = useState();
  const createPayout = (bounty) => {
    return bounty.payoutTokenVolume
      ? {
          tokenAddress: bounty.payoutTokenAddress,
          volume: bounty.payoutTokenVolume,
        }
      : null;
  };
  const payoutBalances = useMemo(() => createPayout(bounty), [bounty]);
  const [payoutValues] = useGetTokenValues(payoutBalances);

  const getPayoutScheduleBalance = (bounty) => {
    const totalPayoutsScheduled = bounty.payoutSchedule?.reduce((acc, payout) => {
      return ethers.BigNumber.from(acc).add(ethers.BigNumber.from(payout));
    });
    return {
      volume: totalPayoutsScheduled?.toLocaleString('fullwide', { useGrouping: false }),
      tokenAddress: bounty.payoutTokenAddress,
    };
  };
  const payoutScheduledBalance = getPayoutScheduleBalance(bounty);
  const [payoutScheduledValue] = useGetValueFromComposite(
    payoutScheduledBalance.tokenAddress,
    payoutScheduledBalance.volume
  );
  const [fundingGoalValue] = useGetValueFromComposite(bounty.fundingGoalTokenAddress, bounty.fundingGoalVolume);
  const budgetValues = bounty.bountyType === '0' ? fundingGoalValue : payoutScheduledValue;
  const getFundsNeeded = (bounty) => {
    const { BigNumber } = ethers;
    if (bounty.fundingGoalVolume) {
      const { fundingGoalTokenAddress, fundingGoalVolume } = bounty;
      const bigNumberBudgetnVolume = BigNumber.from(fundingGoalVolume);
      const token = bounty.bountyTokenBalances?.find((token) => token.tokenAddress === fundingGoalTokenAddress);
      const bigNumberTokenVolume = BigNumber.from(token?.volume || 0);

      const bigNumberVolumeNeeded = bigNumberBudgetnVolume.sub(bigNumberTokenVolume);

      // number from bignumber
      const volumeNeeded = bigNumberVolumeNeeded.toString();
      const tokenMetadata = appState.tokenClient.getToken(fundingGoalTokenAddress);
      let decimals = parseInt(tokenMetadata.decimals) || 18;
      let formattedVolume = ethers.utils.formatUnits(volumeNeeded, decimals);
      return { volume: formattedVolume, symbol: tokenMetadata.symbol };
    } else if (bounty.payoutTokenAddress) {
      const bigNumberBudgetnVolume =
        bounty.bountyType == '1'
          ? BigNumber.from(bounty.payoutTokenVolume)
          : bounty.payoutSchedule.reduce((accum, payout) => {
              return BigNumber.from(payout).add(accum);
            }, BigNumber.from(0));

      const token = bounty.bountyTokenBalances?.find((token) => token.tokenAddress === bounty.payoutTokenAddress);

      const bigNumberTokenVolume = BigNumber.from(token?.volume || 0);

      const bigNumberVolumeNeeded = bigNumberBudgetnVolume.sub(bigNumberTokenVolume);

      // number from bignumber
      const volumeNeeded = bigNumberVolumeNeeded.toString();

      const tokenMetadata = appState.tokenClient.getToken(bounty.payoutTokenAddress);
      let decimals = parseInt(tokenMetadata.decimals) || 18;
      let formattedVolume = ethers.utils.formatUnits(volumeNeeded, decimals);
      return { volume: formattedVolume, symbol: tokenMetadata.symbol };
    }
  };

  useEffect(() => {
    const fundsNeeded = getFundsNeeded(bounty);
    if (!bounty.claims.length) {
      setFundsNeeded(fundsNeeded);
    }
  }, [bounty]);

  const typeName = getBountyTypeName(bounty.bountyType);

  function formatVolume(tierVolume) {
    const tokenMetadata = appState.tokenClient.getToken(bounty.payoutTokenAddress);
    let bigNumberVolume = ethers.BigNumber.from(tierVolume.toString());
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
    return formattedVolume;
  }

  const noRequirements = !bounty.kycRequired && !bounty.invoiceRequired && !bounty.supportingDocumentsRequired;

  return (
    <ul className='lg:max-w-[300px] w-full lg:pl-4 p-8 lg:p-0'>
      {bounty.bountyType && (
        <>
          <li className='border-b border-web-gray py-3'>
            <div className='text-xs font-semibold text-muted'>Type of Contract</div>
            <div className='text-xs font-semibold text-primary leading-loose'>{typeName}</div>
          </li>
          <li className='border-b border-web-gray py-3'>
            <div className='text-xs font-semibold text-muted'>Requirements</div>
            <div className='text-xs font-semibold text-primary leading-loose'>
              {noRequirements ? (
                'None'
              ) : (
                <div className='flex flex-col'>
                  <div>{bounty.invoiceRequired && 'Invoice 📃 '}</div>
                  <div>{bounty.kycRequired && 'KYC 👤 '}</div>
                  <div>{bounty.supportingDocumentsRequired && 'W8/W9 Form 🗒 '}</div>
                </div>
              )}
            </div>
          </li>
        </>
      )}
      {bounty.tvl ? (
        <li className='border-b border-web-gray py-3'>
          <div className='text-xs font-semibold text-muted'>Total Value Locked 🔒</div>
          <button className='text-xs font-semibold text-primary pt-2' onClick={() => setInternalMenu('Fund')}>
            {appState.utils.formatter.format(bounty.tvl)}
          </button>
        </li>
      ) : null}
      {bounty.tvc ? (
        <li className='border-b border-web-gray py-3'>
          <div className='text-xs font-semibold text-muted'>Total Value Claimed 🔓</div>
          <button className='text-xs font-semibold text-primary pt-2' onClick={() => setInternalMenu('Fund')}>
            {appState.utils.formatter.format(bounty.tvc)}
          </button>
        </li>
      ) : null}
      {bounty.tvl < budgetValues?.total && !bounty.claims.length ? (
        <li className='border-b border-web-gray py-3'>
          <div className='text-xs font-semibold text-muted'>🎯 Current Target Budget</div>
          <div className='text-xs font-semibold text-primary pt-2'>
            {appState.utils.formatter.format(budgetValues?.total) || '$0.00'}
          </div>
        </li>
      ) : null}
      {fundsNeeded && parseFloat(fundsNeeded.volume) > 0 && (
        <li className='border-b border-web-gray py-3'>
          <div className='text-xs font-semibold text-muted'>Insolvent</div>
          <div className='text-xs font-semibold text-primary pt-2'>
            Funder still needs to add {fundsNeeded.volume} {fundsNeeded.symbol} to match the {fundsNeeded.symbol}{' '}
            budget.
          </div>
        </li>
      )}

      {bounty.bountyType == 1 ? (
        <li className='border-b border-web-gray py-3'>
          {(split || split === 0) && (
            <>
              <div className='text-xs font-semibold text-muted'>Current Reward Split</div>
              <button className='text-xs font-semibold text-primary' onClick={() => setInternalMenu('Claim')}>
                <TokenBalances
                  lean={true}
                  tokenBalances={payoutBalances}
                  tokenValues={payoutValues}
                  singleCurrency={true}
                  small={true}
                />
              </button>
            </>
          )}
        </li>
      ) : bounty.bountyType == 3 ? (
        <li className='border-b border-web-gray py-3'>
          <div className='text-xs font-semibold text-muted'>Current Payout Schedule</div>
          <div className='flex items-center gap-4 pt-2 text-primary'>
            <div className='text-xs font-semibold leading-loose'>Number of tiers: </div>
            <div className='text-xs font-semibold'>{bounty.payoutSchedule?.length}</div>
          </div>
          <div className='flex flex-col max-h-80 w-full overflow-y-auto overflow-x-hidden'>
            {bounty.payoutSchedule?.map((t, index) => {
              const token = appState.tokenClient.getToken(bounty.payoutTokenAddress);
              return (
                <div key={index} className='flex items-center gap-4 text-primary'>
                  <div className='text-xs font-semibold leading-loose'>{`${appState.utils.handleSuffix(
                    index + 1
                  )} Place:`}</div>
                  <div className='text-xs font-semibold'>
                    {formatVolume(t)} {token.symbol}
                    {bounty.tierWinners?.[index] ? ' ( winner already chosen )' : null}
                  </div>
                </div>
              );
            })}
          </div>
        </li>
      ) : null}
      <>
        {bounty.assignees?.length > 0 && (
          <li className='border-b border-web-gray py-3'>
            <div className='text-xs font-semibold text-muted'>Assignees</div>

            {bounty.assignees.map((assignee, index) => {
              return (
                <div key={index} className='flex items-center gap-2 py-3'>
                  <Image
                    className='rounded-full'
                    height={24}
                    width={24}
                    src={assignee.avatarUrl}
                    alt='Image of the assignee'
                  />
                  <div className='inline-block text-xs pt-1 font-semibold'>{assignee.name}</div>
                </div>
              );
            })}
          </li>
        )}

        {bounty.labels && (
          <li className='border-b border-web-gray py-3'>
            <div className='text-xs font-semibold text-muted pb-2'>GitHub Labels</div>
            {bounty.labels.length > 0 ? <LabelsList bounty={bounty} /> : <span className='text-sm'>No labels</span>}
          </li>
        )}
        <li className='border-b border-web-gray py-3 text sm'>
          <Link href={`https://polygonscan.com/address/${bounty.bountyAddress}`}>
            <div className='text-xs font-semibold  cursor-pointer text-muted'>Polygonscan</div>
          </Link>
          {bounty.bountyAddress && <CopyBountyAddress styles='text-sm pt-2' address={bounty.bountyAddress} />}
        </li>
        <li className='border-b border-web-gray py-3'>
          {bounty?.prs?.some((pr) => pr.source['__typename'] === 'PullRequest' && pr.source.url) > 0 ? (
            <ul>
              <div className='text-xs font-semibold text-muted'>Linked Pull Requests</div>
              {bounty.prs
                .filter((pr) => {
                  return pr.source['__typename'] === 'PullRequest' && pr.source.url;
                })
                .map((pr, index) => {
                  if (pr.source['__typename'] === 'PullRequest' && pr.source.url) {
                    return (
                      <li className='text-sm text-primary' key={index}>
                        <Link href={pr.source.url} target='_blank'>
                          <span className={'underline cursor-pointer'}>{pr.source.title}</span>
                        </Link>
                        <span>{pr.source.merged ? ' (merged)' : ' (not merged)'}</span>
                      </li>
                    );
                  }
                })}
            </ul>
          ) : (
            <span className='text-xs font-semibold text-muted'>No linked pull requests</span>
          )}
        </li>
      </>
    </ul>
  );
};
export default BountyMetadata;
