import React, { useContext, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';
import useEns from '../../hooks/useENS';
import { ethers } from 'ethers';
import Jazzicon from './Jazzicon';
import useWeb3 from '../../hooks/useWeb3';
import ToolTipNew from './ToolTipNew';

const ActionBubble = ({ addresses, bounty, action }) => {
  const [appState] = useContext(StoreContext);
  const [justMinted, setJustMinted] = useState(false);
  const { bodyHTML } = bounty;
  const [senderEnsName] = useEns(action?.sender?.id);
  const [minterEnsName] = useEns(bounty?.issuer?.id);
  const [claimantEnsName] = useEns(action?.claimant?.id);
  const [tokenValues] = useGetTokenValues((action?.receiveTime || action?.refundTime) && action);
  const { account } = useWeb3();

  const getPayout = (bounty) => {
    return action?.claimTime
      ? bounty?.payouts?.filter(
          (payout) => payout.closer.id == action?.claimant?.id && payout?.payoutTime == action?.claimTime
        )
      : null;
  };
  const payoutObj = useMemo(() => getPayout(bounty), [bounty]);
  const [payoutValues] = useGetTokenValues(payoutObj);
  const payoutTotal = appState.utils.formatter.format(payoutValues?.total);

  useEffect(() => {
    const justMinted = sessionStorage.getItem('justMinted');
    if (justMinted) {
      setJustMinted(true);
    }
  }, []);

  const shortenAddress = (address) => {
    if (!address) {
      return '';
    }
    return `${address.slice(0, 4)}...${address.slice(38)}`;
  };
  const minter = minterEnsName || (bounty.issuer && shortenAddress(bounty.issuer.id));

  let titlePartOne = `${minter} minted this contract on ${appState.utils.formatUnixDate(bounty.bountyMintTime)}.`;
  let titlePartTwo = '';
  let avatarUrl, url, name;
  let address = bounty.issuer?.id;
  if (!action && !minter) {
    if (justMinted) {
      titlePartOne = `${account} minted this contract on ${appState.utils.formatUnixDate(Date.now() / 1000)}.`;
    } else {
      titlePartOne = 'Waiting for this contract to be indexed by the Graph.';
    }
  }

  if (action?.closingTime) {
    titlePartOne = `${minter} closed this contract on ${appState.utils.formatUnixDate(action.closingTime)}.`;
  }

  if (action?.claimTime) {
    const claimant = claimantEnsName || shortenAddress(action.claimant.id);
    address = action.claimant.id;
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
    let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
    if (action.receiveTime) {
      titlePartOne = `${funder} funded this contract with ${formattedVolume} ${
        tokenMetadata.symbol
      } (${appState.utils.formatter.format(tokenValues?.total)}) on ${appState.utils.formatUnixDate(
        action.receiveTime
      )}.`;
    } else if (action.refundTime) {
      titlePartOne = `${funder} refunded a deposit of ${formattedVolume} ${
        tokenMetadata.symbol
      } (${appState.utils.formatter.format(tokenValues?.total)}) on ${appState.utils.formatUnixDate(
        action.refundTime
      )}.`;
    }
  }
  return (
    <div className='w-full pt-4 flex relative'>
      {action ? (
        avatarUrl ? (
          <Link href={url}>
            <a className='w-9 h-9 flex-none'>
              <ToolTipNew toolTipText={name} relativePosition={'-left-2'} outerStyles={'relative bottom-2'}>
                <Image className='rounded-full' height={36} width={36} src={avatarUrl} />
              </ToolTipNew>
            </a>
          </Link>
        ) : (
          <Jazzicon tooltipPosition={'-left-2'} size={36} address={address} />
        )
      ) : (
        <div className='relative w-9'>
          {addresses.reverse().map((address, index) => {
            return (
              <div
                key={index}
                className={`h-4 w-10 z-${30 - index * 10} bg-transparent cursor-pointer relative hover:z-40`}
              >
                <Jazzicon tooltipPosition={'-left-2'} key={index} size={36} address={address} />
              </div>
            );
          })}
        </div>
      )}
      <div className='w-full flex-0 rounded-sm overflow-hidden ml-4 border-web-gray border-b before:w-2 before:h-2 before:bg-nav-bg before:absolute before:absolute before:left-12 before:top-[34px] before:border-b  before:border-l before:border-web-gray before:rotate-45  border'>
        <div className={`bg-nav-bg w-full pl-3 ${!action && 'border-web-gray'} flex justify-between`}>
          <span className='py-2'>
            <span data-testid='actionTitle'>{tokenValues || titlePartOne}</span>
            {action?.url && (
              <a className='inline underline' href={action.url}>
                {action.title}
              </a>
            )}
            <span>{titlePartTwo}</span>
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
