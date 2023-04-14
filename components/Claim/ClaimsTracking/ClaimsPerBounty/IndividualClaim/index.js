import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../../../../store/Store/StoreContext';
import Link from 'next/link';
import { ethers } from 'ethers';
import useWeb3 from '../../../../../hooks/useWeb3';

const IndividualClaim = ({
  payout,
  bounty,
  index,
  gridFormat,
  paginationState,
  setFilteredTiers,
  filteredTiers,
  setFilteredCount,
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
  const [KYC, setKYC] = useState(false);
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const githubIdFilter = paginationState[0].filters.searchText?.githubId;
  const claimFilter = paginationState[0].filters.searchText?.claimed;
  const w8Filter = paginationState[0].filters.searchText?.w8 || 'all';
  const kycFilter = paginationState[0].filters.searchText?.kyc || 'all';
  const walletFilter = paginationState[0].filters.searchText?.walletAddress;
  const [w8Status, setW8Status] = useState('NOT SENT');
  const [walletCondition, setWalletCondition] = useState(true);
  const githubCondition = githubIdFilter && bounty.tierWinners?.[index] !== githubIdFilter;
  const claimCondition =
    (claimFilter == 'true' && !bounty.claims?.some((claim) => claim.tier == index)) ||
    (claimFilter == 'false' && bounty.claims?.some((claim) => claim.tier == index));
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
          }
        } catch (err) {
          appState[0].logger.error(err, 'IndividualClaim.js2');
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
          appState[0].logger.error(err, 'IndividualClaim.js3');
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
    if (githubCondition || claimCondition || w8Condition || kycCondition || !walletCondition) {
      newFilteredTiers[index] = false;
      setFilteredTiers(newFilteredTiers);
      setFilteredCount(newFilteredTiers?.filter((value) => value == true)?.length || 0);
      setHide('hidden');
    } else {
      newFilteredTiers[index] = true;
      setFilteredTiers(newFilteredTiers);
      setFilteredCount(newFilteredTiers?.filter((value) => value == true)?.length || 0);
      setHide('');
    }
  }, [
    paginationState[0].filters.searchText,
    githubCondition,
    claimCondition,
    w8Condition,
    kycCondition,
    walletCondition,
  ]);
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
      {githubUser?.url ? (
        <div className='flex gap-2 '>
          <Link href={githubUser?.url} target='_blank' className=' text-link-colour hover:underline '>
            {githubUser.login}
          </Link>{' '}
          ({githubUser.id})
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
        {w8Status}
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
          bounty.claims?.some((claim) => claim.tier == index) && 'font-bold text-green'
        }`}
      >
        {bounty.claims?.some((claim) => claim.tier == index) ? 'TRUE' : 'FALSE'}
      </div>
    </div>
  );
};

export default IndividualClaim;
