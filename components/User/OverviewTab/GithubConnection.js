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

const GithubConnection = ({ user, claimPage, setVerified }) => {
  const [appState] = useContext(StoreContext);
  const { account } = useWeb3();
  const { accountData } = appState;
  const loggedId = accountData?.id;
  const isOwner = claimPage ? true : loggedId == user.id;
  const [authState] = useContext(AuthContext);
  const { githubId } = authState;
  const [externalUserId, setExternalUserId] = useState(null);
  const [externalUserIdLoading, setExternalUserIdLoading] = useState(true);
  const { library } = useWeb3();

  // State

  useEffect(() => {
    const checkAssociatedExternalId = async () => {
      if (library && account && githubId) {
        const externalUserId = await appState.openQClient.getExternalUserIdByAddress(library, account);
        if (externalUserId) {
          setExternalUserId(externalUserId);
          setExternalUserIdLoading(false);
        }
        setExternalUserIdLoading(false);
      }
    };
    checkAssociatedExternalId();
  }, [library, account, githubId]);

  useEffect(() => {
    if (externalUserId && githubId) setVerified(true);
  }, [externalUserId]);

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

            {!externalUserIdLoading && (
              <>
                <div className='flex gap-2'>
                  <Chain className={'w-6 h-6  fill-primary'} />

                  <span>
                    {externalUserId && githubId
                      ? `Signed in Github profile associated with address ${appState.utils.shortenAddress(
                          account
                        )} on chain.`
                      : !githubId
                      ? 'Github profile not signed in.'
                      : 'No address associated with current Github profile on Chain.'}
                  </span>
                </div>
                {externalUserId !== githubId && githubId && (
                  <AssociateModal
                    setExternalUserId={setExternalUserId}
                    claimPage={claimPage}
                    enableLink={true}
                    activeBtnStyles={claimPage ? 'w-fit bg-transparent border-none p-0' : 'col-span-2 w-full '}
                    btnText={
                      claimPage
                        ? [
                            <div key={1} className='flex items-center gap-2 btn-requirements'>
                              <Github className={'h-4 w-4'} />
                              Start
                            </div>,
                          ]
                        : 'Associate Current Address'
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default GithubConnection;
