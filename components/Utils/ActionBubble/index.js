import React, { useContext, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useGetTokenValues from '../../../hooks/useGetTokenValues';
import StoreContext from '../../../store/Store/StoreContext';
import useEns from '../../../hooks/useENS';
import { ethers } from 'ethers';
import Jazzicon from './../Jazzicon';
import useWeb3 from '../../../hooks/useWeb3';
import ToolTipNew from './../ToolTipNew';

const ActionBubble = ({ bounty, action }) => {
  const [appState] = useContext(StoreContext);
  const [justMinted, setJustMinted] = useState(false);
  const { bodyHTML } = bounty;
  const [senderEnsName] = useEns(action?.sender?.id);
  const { library, account } = useWeb3();
  const [minterEnsName] = useEns(bounty?.issuer?.id || account);
  const [refunderEnsName] = useEns(action?.sender?.id);
  const [claimantEnsName] = useEns(action?.claimant?.id);
  const [NFT, setNFT] = useState({ title: 'an NFT' });
  const [tokenValues] = useGetTokenValues((action?.receiveTime || action?.refundTime) && action);

  const getPayout = (bounty) => {
    return action?.claimTime
      ? bounty?.payouts?.filter(
          (payout) => payout.closer.id == action?.claimant?.id && payout?.payoutTime == action?.claimTime
        )
      : null;
  };
  const payoutObj = useMemo(() => getPayout(bounty), [bounty]);
  const [payoutValues] = useGetTokenValues(payoutObj);
  const payoutTotal = appState.utils.formatter.format(payoutValues?.total || 0);

  useEffect(() => {
    const justMinted = sessionStorage.getItem('justMinted');
    if (justMinted === 'true') {
      setJustMinted(true);
    }
  }, []);

  useEffect(() => {
    const getNft = async () => {
      if (action?.isNft && action.receiveTime && library) {
        const NFT = await appState.openQClient.getNFT(library, action.tokenAddress, action.tokenId);

        setNFT({ title: `${NFT.name} #${action.tokenId}`, uri: NFT.uri });
      }
    };
    getNft();
  }, [action, library]);

  const shortenAddress = (address) => {
    if (!address) {
      return '';
    }
    if (ethers.utils.isAddress(address)) {
      const checkSummedAddress = ethers.utils.getAddress(address);
      return `${checkSummedAddress.slice(0, 4)}...${checkSummedAddress.slice(38)}`;
    }
  };
  const minter = minterEnsName || (bounty.issuer && shortenAddress(bounty.issuer.id)) || shortenAddress(account);
  let titlePartOne = `${minter} minted this contract on ${appState.utils.formatUnixDate(bounty.bountyMintTime)}.`;
  let titlePartTwo = '';
  let avatarUrl, url, name;
  let address = bounty.issuer?.id;
  if (!action) {
    if (justMinted) {
      address = account;
      const currentDate = Date.now();
      titlePartOne = `${minter} minted this contract on ${appState.utils.formatUnixDate(currentDate / 1000)}.`;
      name = minter;
    } else if (!bounty.issuer) {
      titlePartOne = 'Waiting for this contract to be indexed by the Graph.';
    } else {
      titlePartOne = `${minter} minted this contract on ${appState.utils.formatUnixDate(bounty.bountyMintTime)}.`;
      name = minter;
    }
  }

  if (action?.closingTime) {
    titlePartOne = `${minter} closed this contract on ${appState.utils.formatUnixDate(action.closingTime)}.`;
    name = minter;
  }

  if (action?.claimTime) {
    const claimant = claimantEnsName || shortenAddress(action.claimant.id);
    address = action.claimant.id;
    name = claimant;
    if (bounty.bountyType === '0') {
      titlePartOne = `${claimant} claimed ${payoutTotal} on this contract on ${appState.utils.formatUnixDate(
        action.claimTime
      )}.`;
    } else {
      titlePartOne = `${claimant} made a claim of ${payoutTotal} on this contract on ${appState.utils.formatUnixDate(
        action.claimTime
      )}.`;
    }
  }
  if (action?.referencedTime) {
    if (action.mergedTime) {
      const author = action.mergeCommit.author;
      avatarUrl = author.avatarUrl;
      name = author.user.login;
      url = author.user.url;
      address = name;
      titlePartOne = `${name} merged linked pull request: `;

      titlePartTwo = ` on ${appState.utils.formatUnixDate(action.referencedTime)}.`;
    } else {
      avatarUrl = action.author.avatarUrl;
      name = action.author.login;
      url = action.author.url;
      address = name;
      titlePartOne = `${name} linked `;
      titlePartTwo = ` to this issue on ${appState.utils.formatUnixDate(action.referencedTime)}.`;
    }
  }

  if (action?.issueClosedTime) {
    avatarUrl = action.actor.avatarUrl;
    name = action.actor.login;
    url = action.actor.url;
    address = name;
    titlePartOne = `${name} closed this issue on ${appState.utils.formatUnixDate(action.issueClosedTime)}.`;
  }

  if (action?.receiveTime || action?.refundTime) {
    const refunder = bounty.deposits.filter((deposit) => deposit.id === action.depositId)[0]?.sender?.id;
    const funder = senderEnsName || shortenAddress(action.sender?.id) || shortenAddress(refunder);
    address = action.sender?.id || bounty.issuer.id;
    const { volume } = action;
    const tokenMetadata = appState.tokenClient.getToken(action.tokenAddress);
    let bigNumberVolume = ethers.BigNumber.from(volume.toString());
    let decimals = parseInt(tokenMetadata.decimals) || 18;
    let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals) || '';
    const usdValue = appState.utils.formatter.format(tokenValues?.total);

    if (action.receiveTime) {
      const addStrings = (a, b) => {
        return parseInt(a) + parseInt(b);
      };
      const expiryDate = appState.utils.formatUnixDate(addStrings(action.receiveTime, action.expiration));

      if (action.isNft) {
        titlePartOne = `${funder} funded this contract with `;
        titlePartTwo = ` on ${appState.utils.formatUnixDate(
          action.receiveTime
        )}. This deposit will expire on ${expiryDate}.`;
      } else {
        name = funder;
        titlePartOne = isNaN(tokenValues?.total)
          ? ''
          : `${funder} funded this contract with ${formattedVolume} ${
              tokenMetadata.symbol
            } (${usdValue}) on ${appState.utils.formatUnixDate(
              action.receiveTime
            )}. This deposit will expire on ${expiryDate}.`;
      }
    } else if (action.refundTime) {
      name = refunderEnsName || shortenAddress(refunder);
      address = refunder;
      titlePartOne = isNaN(tokenValues?.total)
        ? ''
        : `${name} refunded a deposit of ${formattedVolume} ${tokenMetadata.symbol} (${appState.utils.formatter.format(
            tokenValues?.total
          )}) on ${appState.utils.formatUnixDate(action.refundTime)}.`;
    }
  }
  return (
    <div className='w-full pt-4 flex relative'>
      {avatarUrl ? (
        <Link href={url} className='w-9 h-9 flex-none'>
          <>
            {' '}
            <ToolTipNew toolTipText={name} relativePosition={'-left-2'} outerStyles={'relative bottom-2'}>
              <>
                <Image className='rounded-full' height={36} width={36} src={avatarUrl} alt='avatar' />
              </>
            </ToolTipNew>
          </>
        </Link>
      ) : address ? (
        <Jazzicon tooltipPosition={'-left-2'} size={36} address={address} name={name} />
      ) : (
        <div className='w-9 h-9 flex-none'></div>
      )}
      <div
        className={` w-full bg-nav-bg flex-0 rounded-sm overflow-hidden ml-4 border-web-gray border-b ${
          !bounty.issuer
            ? null
            : 'before:w-2 before:h-2 before:bg-nav-bg before:absolute before:left-12 before:top-[34px] before:border-b  before:border-l before:border-web-gray before:rotate-45'
        }  border`}
      >
        <div className={` w-full pl-3 flex justify-between`}>
          <span className='py-2'>
            <span data-testid='actionTitle'>{titlePartOne}</span>

            {(action?.url || NFT.uri) && (
              <a className='inline underline' target='_blank' href={action.url || NFT.uri} rel='noreferrer'>
                {action.title || NFT.title}
              </a>
            )}
            <span className='text-left'>{titlePartTwo}</span>
          </span>
          {action?.refunded && (
            <span className='flex items-center border rounded-sm border-web-gray px-2 py-px m-1'> Refunded</span>
          )}
        </div>
        {!action && bodyHTML && (
          <div
            className='w-full p-8 p-4 border-web-gray border-t markdown-body'
            dangerouslySetInnerHTML={{
              __html: bodyHTML,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};
export default ActionBubble;
