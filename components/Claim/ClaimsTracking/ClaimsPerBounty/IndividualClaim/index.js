import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../../../../store/Store/StoreContext';
import Link from 'next/link';
import { ethers } from 'ethers';
import useWeb3 from '../../../../../hooks/useWeb3';
import ToolTipNew from '../../../../Utils/ToolTipNew';

const IndividualClaim = ({
  payout,
  bounty,
  index,
  gridFormat,
  setFilteredTiers,
  filteredTiers,
  setFilteredInfo,
  filteredInfo,
  filters,
}) => {
  const appState = useContext(StoreContext);
  const { chainId, library, account } = useWeb3(true);
  const token = appState[0].tokenClient.getToken(bounty?.payoutTokenAddress);
  const formattedToken = ethers.utils.formatUnits(
    ethers.BigNumber.from(payout.toString()),
    parseInt(token.decimals) || 18
  );
  const [githubUser, setGithubUser] = useState('');
  const [associatedAddress, setAssociatedAddress] = useState('');
  const [requested, setRequested] = useState(false);
  const [message, setMessage] = useState('');
  const [KYC, setKYC] = useState(false);
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const githubIdFilter = filters?.githubId;
  const claimFilter = filters?.claimed;
  const w8Filter = filters?.w8 || 'all';
  const kycFilter = filters?.kyc || 'all';
  const walletFilter = filters?.walletAddress;
  const [w8Status, setW8Status] = useState('NOT SENT');
  const [walletCondition, setWalletCondition] = useState(true);
  const githubCondition = githubIdFilter && bounty.tierWinners?.[index] !== githubIdFilter;
  const claimCondition =
    (claimFilter == 'true' && !bounty.payouts?.some((payout) => payout.closer.id == associatedAddress)) ||
    (claimFilter == 'false' && bounty.payouts?.some((payout) => payout.closer.id == associatedAddress));
  const w8Condition = w8Filter !== 'all' && w8Filter !== w8Status.toLowerCase();
  const kycCondition = (kycFilter == 'true' && !KYC) || (kycFilter == 'false' && KYC);
  const [hide, setHide] = useState('');
  useEffect(() => {
    if (bounty.tierWinners?.[index]) {
      const getGithubUser = async () => {
        const githubUser = await appState[0].githubRepository.fetchUserById(bounty.tierWinners?.[index]);
        if (githubUser) {
          setGithubUser(githubUser);
        }
      };
      try {
        getGithubUser();
      } catch (err) {
        appState.logger.error(err, 'IndividualClaim.js1');
      }
    }
  }, [bounty]);
  useEffect(() => {
    const checkRequested = async () => {
      if (githubUser.id) {
        try {
          const user = await appState[0].openQPrismaClient.getPublicUser(githubUser.id);
          if (user) {
            const request = bounty.requests?.nodes?.find((node) => node.requestingUser.id === user.id);
            setRequested(request);
            console.log(request);
            if (request) {
              const privateRequest = await appState[0].openQPrismaClient.getPrivateRequest(request.id);
              setMessage(privateRequest?.message);
            }
          }
        } catch (err) {
          appState[0].logger.error(err, 'IndividualClaim.js3');
        }
      }
    };
    const checkAssociatedAddress = async () => {
      if (githubUser.id) {
        try {
          const associatedAddressSubgraph = await appState[0].openQSubgraphClient.getUserByGithubId(githubUser.id);
          const associatedAddress = associatedAddressSubgraph.id;
          if (associatedAddress !== zeroAddress) {
            setAssociatedAddress(associatedAddress);
          }
        } catch (err) {
          appState[0].logger.error(err, 'IndividualClaim.js4');
        }
      }
    };
    checkRequested();
    checkAssociatedAddress();
  }, [githubUser]);
  useEffect(() => {
    const currentW8Status = bounty.supportingDocumentsCompleted?.[index]
      ? 'APPROVED'
      : requested
      ? 'PENDING'
      : 'NOT SENT';
    setW8Status(currentW8Status);
  }, [bounty, requested, w8Filter]);
  useEffect(() => {
    checkWallet();
  }, [walletFilter, associatedAddress]);
  useEffect(() => {
    let newFilteredTiers = filteredTiers;
    let newCount = 0;
    let newFilteredInfo = filteredInfo;
    if (githubCondition || claimCondition || w8Condition || kycCondition || !walletCondition) {
      newFilteredTiers[index] = false;
      newCount = newFilteredTiers?.filter((value) => value == true)?.length || 0;
      setHide('hidden');
    } else {
      newFilteredTiers[index] = true;
      newCount = newFilteredTiers?.filter((value) => value == true)?.length || 0;
      setHide('');
    }
    setFilteredTiers(newFilteredTiers);
    newFilteredInfo[bounty.id] = { filteredCount: newCount };
    setFilteredInfo({ ...filteredInfo, ...newFilteredInfo });
  }, [filters, githubCondition, claimCondition, w8Condition, kycCondition, walletCondition]);
  useEffect(() => {
    if (associatedAddress && chainId == 137) hasKYC();
  }, [chainId, associatedAddress]);
  const checkWallet = () => {
    if (walletFilter?.length > 0) {
      setWalletCondition(walletFilter.toLowerCase() == associatedAddress.toLowerCase());
    } else {
      setWalletCondition(true);
    }
  };
  const hasKYC = async () => {
    try {
      const transaction = await appState[0].openQClient.hasKYC(library, associatedAddress);
      if (transaction) {
        setKYC(true);
      }
    } catch (err) {
      appState[0].logger.error(err, 'IndividualClaim.js4');
    }
  };
  return (
    <div className={`${hide} text-sm items-center gap-4 ${gridFormat}`}>
      {bounty.tierWinners?.[index] ? (
        <div className='flex gap-2 '>
          {githubUser?.url ? (
            <Link href={githubUser?.url} target='_blank' className=' text-link-colour hover:underline '>
              {githubUser.login}
            </Link>
          ) : (
            'Loading...'
          )}{' '}
          ({bounty.tierWinners?.[index]})
        </div>
      ) : (
        <div className='text-gray-500'> Not Yet Assigned</div>
      )}
      <div className='flex justify-center'>
        {formattedToken} {token.symbol}
      </div>
      <div
        className={`flex justify-center ${
          bounty.supportingDocumentsCompleted?.[index]
            ? 'font-bold text-green'
            : requested
            ? 'text-red-400'
            : 'text-gray-500'
        }`}
      >
        {message ? (
          <ToolTipNew innerStyles={'whitespace-normal w-80 text-primary'} toolTipText={message}>
            <div className='flex gap-2 items-center'>
              <div>{w8Status}</div>
              <div className='cursor-help p-0 rounded-full border border-[#c9d1d9] aspect-square leading-3 h-3 box-content text-center font-bold text-primary text-xs'>
                i
              </div>
            </div>
          </ToolTipNew>
        ) : (
          <> {w8Status}</>
        )}
      </div>
      <div className={`flex justify-center ${KYC && 'font-bold text-green'}`}>
        {account ? KYC.toString().toUpperCase() : 'n.a.*'}
      </div>
      <div className={`flex justify-center`}>
        {associatedAddress ? (
          <Link
            href={`https://polygonscan.com/address/${associatedAddress}`}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline'
          >
            {appState[0].utils.shortenAddress(associatedAddress)}
          </Link>
        ) : (
          <span className='text-gray-500'>---</span>
        )}
      </div>
      <div
        className={`flex justify-center ${
          bounty.payouts?.some((payout) => payout.closer.id == associatedAddress) && 'font-bold text-green'
        }`}
      >
        {bounty.payouts?.some((payout) => payout.closer.id == associatedAddress) ? 'TRUE' : 'FALSE'}
      </div>
    </div>
  );
};

export default IndividualClaim;
