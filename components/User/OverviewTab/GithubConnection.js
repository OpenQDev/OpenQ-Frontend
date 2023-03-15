// Third party
import React, { useContext, useEffect, useState } from 'react';

// Custom
import ShieldCheck from '../../svg/shieldCheck';
import StoreContext from '../../../store/Store/StoreContext';
import AuthButton from '../../Authentication/AuthButton';
import Chain from '../../svg/chain';
import useWeb3 from '../../../hooks/useWeb3';
import AssociateModal from '../GithubRegistration/AssociateModal';
import AuthContext from '../../../store/AuthStore/AuthContext';
import Github from '../../svg/github';
import Image from 'next/image';
import Link from 'next/link';

const GithubConnection = ({ user, claimPage, setVerified, setClaimPageError }) => {
  const [appState] = useContext(StoreContext);
  const { account } = useWeb3();
  const { accountData } = appState;
  const loggedId = accountData?.id;
  const isOwner = claimPage ? true : loggedId == user.id;
  const [authState] = useContext(AuthContext);
  const { githubId } = authState;
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const [associatedAddress, setAssociatedAddress] = useState(null);
  const [associatedAddressLoading, setAssociatedAddressLoading] = useState(false);
  let hasAssociatedAddress = associatedAddress && associatedAddress !== zeroAddress;
  // State

  useEffect(() => {
    const checkAssociatedAddress = async () => {
      if (githubId) {
        try {
          const associatedAddressSubgraph = await appState.openQSubgraphClient.getUserByGithubId(githubId);
          const associatedAddress = associatedAddressSubgraph.id;
          if (associatedAddress !== zeroAddress) {
            setVerified(true);
            setAssociatedAddress(associatedAddress);
            setAssociatedAddressLoading(false);
          }
        } catch (err) {
          appState.logger.error(err, accountData.id, 'GithubConnection.js1');
        }
        setAssociatedAddressLoading(false);
      }
    };
    checkAssociatedAddress();
  }, [account, githubId]);
  useEffect(() => {
    if (associatedAddress && associatedAddress !== zeroAddress) {
      setVerified(true);
    }
  }, [associatedAddress]);
  return (
    <>
      {isOwner && (
        <div className={`${claimPage ? '' : 'px-8 py-6 pb border-t border-web-gray'}`}>
          <h2 className={`${claimPage ? 'hidden' : 'font-semibold text-lg pb-2'}`}>Github Connection</h2>
          <div className={'flex flex-col w-fit justify-between gap-4 my-4 content-center'}>
            {!claimPage && (
              <>
                {authState.github && (
                  <>
                    <ShieldCheck className={'w-6 h-6 fill-primary'} />
                    Signed in as {authState.login}
                  </>
                )}
                <AuthButton className={' col-span-2 mb-8'} />
              </>
            )}

            {!associatedAddressLoading && (
              <>
                <div className='flex gap-2'>
                  <Chain className={'w-6 h-6  fill-primary'} />

                  <span>
                    {associatedAddress && githubId ? (
                      <>
                        Github profile{' '}
                        <Link
                          href={`https://github.com/${authState.login}`}
                          rel='noopener norefferer'
                          target='_blank'
                          className='text-link-colour hover:underline'
                        >
                          {authState.login}
                        </Link>{' '}
                        associated with address{' '}
                        <Link
                          href={`https://polygonscan.com/address/${associatedAddress}`}
                          rel='noopener norefferer'
                          target='_blank'
                          className='text-link-colour hover:underline'
                        >
                          {appState.utils.shortenAddress(associatedAddress)}
                        </Link>{' '}
                        on Polygon.
                      </>
                    ) : !githubId ? (
                      'Github profile not signed in.'
                    ) : (
                      <>
                        No Ethereum address associated with current Github profile{' '}
                        <Link
                          href={`https://github.com/${authState.login}`}
                          rel='noopener norefferer'
                          target='_blank'
                          className='text-link-colour hover:underline'
                        >
                          {authState.login}
                        </Link>
                        .
                      </>
                    )}
                  </span>
                </div>
                <div className='flex gap-2 w-fit'>
                  {claimPage && hasAssociatedAddress && (
                    <div key={2} className='flex items-center gap-2  btn-primary hover:none h-8 w-fit'>
                      <Image src='/BountyMaterial/polyscan-white.png' width={20} height={20} alt='link-icon' />
                      Verified
                    </div>
                  )}
                  {githubId && (
                    <AssociateModal
                      setAssociatedAddress={setAssociatedAddress}
                      claimPage={claimPage}
                      setClaimPageError={setClaimPageError}
                      enableLink={true}
                      activeBtnStyles={claimPage ? 'w-fit bg-transparent border-none p-0' : 'col-span-2 w-full '}
                      hasAssociatedAddress={hasAssociatedAddress}
                      btnText={
                        claimPage
                          ? [
                              <div key={1} className='flex w-fit items-center gap-2 btn-requirements h-8'>
                                <Github className={'h-4 w-4'} />
                                {hasAssociatedAddress ? 'Update' : 'Start'}
                              </div>,
                            ]
                          : hasAssociatedAddress
                          ? 'Update Associated Address'
                          : 'Associate Current Address'
                      }
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default GithubConnection;
