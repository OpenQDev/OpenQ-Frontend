import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../../../../store/Store/StoreContext';
import Link from 'next/link';
import { ethers } from 'ethers';
import useWeb3 from '../../../../../hooks/useWeb3';

const IndividualClaim = ({ payout, bounty, index, gridFormat }) => {
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
    // chainId to 80001 if tested on Mumbai
    if (associatedAddress && chainId == 137) hasKYC();
  }, [chainId, associatedAddress]);
  const hasKYC = async () => {
    try {
      const transaction = await appState[0].openQClient.hasKYC(library, associatedAddress);
      if (transaction) {
        setKYC(true);
      }
    } catch (err) {
      appState[0].logger.error(err, 'IndividualClaim.js3');
    }
  };
  return (
    <div className={`text-sm items-center gap-4 ${gridFormat}`}>
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
        {bounty.supportingDocumentsCompleted?.[index] ? 'APPROVED' : requested ? 'PENDING' : 'NOT SENT'}
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
