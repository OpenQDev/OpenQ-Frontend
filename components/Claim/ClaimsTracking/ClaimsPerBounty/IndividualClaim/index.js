import React, { useContext, useEffect, useRef, useState } from 'react';
import StoreContext from '../../../../../store/Store/StoreContext';
import Link from 'next/link';
import { ethers } from 'ethers';
import useWeb3 from '../../../../../hooks/useWeb3';
import useIsOnCorrectNetwork from '../../../../../hooks/useIsOnCorrectNetwork';
import CopyAddressToClipboard from '../../../../CopyAddressToClipboard';
import { LinkIcon } from '@primer/octicons-react';

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
  winnersInfo,
}) => {
  const appState = useContext(StoreContext);
  const modalRef = useRef();
  const buttonRef = useRef();
  const [showAccountModal, setShowAccountModal] = useState();
  const { chainId, library, account, error } = useWeb3();
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork({
    chainId: chainId,
    error: error,
    account: account,
  });

  const token = appState[0].tokenClient.getToken(bounty?.payoutTokenAddress);
  const formattedToken = ethers.utils.formatUnits(
    ethers.BigNumber.from(payout.toString()),
    parseInt(token.decimals) || 18
  );
  const githubUserId = bounty.tierWinners?.[index];
  const githubUser = winnersInfo && winnersInfo?.find((winner) => winner.id === githubUserId);
  const [associatedAddress, setAssociatedAddress] = useState('');
  const [requested, setRequested] = useState(false);
  const [message, setMessage] = useState('');
  const [KYC, setKYC] = useState(false);
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const githubFilter = filters?.github;
  const claimFilter = filters?.claimed;
  const w8Filter = filters?.w8 || 'all';
  const kycFilter = filters?.kyc || 'all';
  const walletFilter = filters?.walletAddress;
  const [w8Status, setW8Status] = useState('NOT SENT');
  const [walletCondition, setWalletCondition] = useState(true);
  const githubCondition =
    githubFilter && !githubUserId?.includes(githubFilter) && !githubUser?.login.includes(githubFilter);
  const [claimed, setClaimed] = useState(bounty?.claims?.some((claim) => claim.tier == index));
  const [claimCondition, setClaimCondition] = useState(true);
  const w8Condition = w8Filter !== 'all' && w8Filter !== w8Status.toLowerCase();
  const kycCondition = (kycFilter == 'true' && !KYC) || (kycFilter == 'false' && KYC);
  const [hide, setHide] = useState('');

  useEffect(() => {
    let handler = (event) => {
      if (!modalRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setShowAccountModal(false);
      }
    };
    window.addEventListener('mousedown', handler);

    return () => {
      window.removeEventListener('mousedown', handler);
    };
  });
  useEffect(() => {
    const claimCondition = (claimFilter == 'true' && !claimed) || (claimFilter == 'false' && claimed);
    setClaimCondition(claimCondition);
  }, [claimFilter, claimed]);
  useEffect(() => {
    const checkRequested = async () => {
      if (githubUserId) {
        try {
          const user = await appState[0].openQPrismaClient.getPublicUser(githubUserId);
          if (user) {
            const request = bounty.requests?.nodes?.find((node) => node.requestingUser.id === user.id);
            setRequested(request);
            if (request) {
              const privateRequest = await appState[0].openQPrismaClient.getPrivateRequest(request.id);
              setMessage(privateRequest?.message);
            }
          }
        } catch (err) {
          appState[0].logger.error(err, 'IndividualClaim.js1');
        }
      }
    };
    const checkAssociatedAddress = async () => {
      if (githubUserId) {
        try {
          const associatedAddressSubgraph = await appState[0].openQSubgraphClient.getUserByGithubId(githubUserId);
          const associatedAddress = associatedAddressSubgraph?.id;
          if (associatedAddress !== zeroAddress) {
            setAssociatedAddress(associatedAddress);
          }
        } catch (err) {
          appState[0].logger.error(err, 'IndividualClaim.js2');
        }
      }
    };
    checkRequested();
    checkAssociatedAddress();
  }, [githubUserId]);
  useEffect(() => {
    setClaimed(bounty?.claims?.some((claim) => claim.tier == index));
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
      setWalletCondition(associatedAddress?.toLowerCase().includes(walletFilter.toLowerCase()));
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
      appState[0].logger.error(err, 'IndividualClaim.js3');
    }
  };
  return (
    <div className={`${hide} text-sm items-center gap-4 ${gridFormat}`}>
      {githubUserId ? (
        <div className='flex gap-2 '>
          {githubUser?.url ? (
            <Link href={githubUser?.url} target='_blank' className=' text-link-colour hover:underline '>
              {githubUser.login}
            </Link>
          ) : (
            'Loading...'
          )}{' '}
          ({githubUserId})
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
        {!bounty.supportingDocumentsCompleted?.[index] && message ? (
          <div>
            <button
              ref={buttonRef}
              onClick={() => {
                setShowAccountModal(!showAccountModal);
              }}
              className='group flex items-center gap-x-1 whitespace-nowrap font-semibold cursor-pointer'
            >
              <div>{w8Status}</div>
              <div className='cursor-pointer p-0 rounded-full border border-[#c9d1d9] aspect-square leading-3 h-3 box-content text-center font-bold text-primary text-xs'>
                i
              </div>
            </button>
            {showAccountModal && (
              <div className='flex mr-4 flex-col items-center'>
                <div className='flex -mt-1 tooltip-triangle absolute'></div>
                <div className='flex z-10 -mt-1 tooltip-triangle absolute'></div>

                <div ref={modalRef} className='flex absolute  max-w-[960px] flex-col mt-0 z-[5] tooltip rounded-sm p-0'>
                  <div className='flex whitespace-normal text-[#c9d1d9] items-center w-full p-2'>
                    Requested changes: {message}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>{w8Status}</>
        )}
      </div>
      <div className={`flex justify-center ${KYC && 'font-bold text-green'}`}>
        {isOnCorrectNetwork ? KYC.toString().toUpperCase() : 'n.a.*'}
      </div>
      <div className={`flex justify-center`}>
        {associatedAddress ? (
          <div className='flex items-center gap-1'>
            <CopyAddressToClipboard clipping={[3, 39]} data={associatedAddress} styles={''} />
            <Link
              href={`https://polygonscan.com/address/${associatedAddress}`}
              rel='noopener norefferer'
              target='_blank'
              className='text-link-colour hover:underline'
            >
              <LinkIcon />
            </Link>
          </div>
        ) : (
          <span className='text-gray-500'>---</span>
        )}
      </div>
      <div className={`flex justify-center ${claimed && 'font-bold text-green'}`}>{claimed ? 'TRUE' : 'FALSE'}</div>
    </div>
  );
};

export default IndividualClaim;
