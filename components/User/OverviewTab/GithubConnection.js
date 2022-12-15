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

const GithubConnection = ({ user }) => {
  const [appState] = useContext(StoreContext);
  const { account } = useWeb3();
  const { accountData } = appState;
  const loggedId = accountData?.id;
  const isOwner = loggedId == user.id;
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

  return (
    <>
      {isOwner && (
        <div className='px-8 py-6 pb border-t border-web-gray'>
          <h2 className='font-semibold text-lg pb-2'>Github Connection</h2>
          <div className='grid grid-cols-[0.1fr_1.9fr] w-fit justify-between gap-4 my-4 content-center'>
            {authState.isAuthenticated && (
              <>
                <ShieldCheck className={'w-6 h-6 fill-primary'} />
                Signed in as {authState.login}
              </>
            )}
            <AuthButton className={' col-span-2 mb-8'} />

            {!externalUserIdLoading && (
              <>
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
                {externalUserId !== githubId && githubId && (
                  <AssociateModal
                    setExternalUserId={setExternalUserId}
                    enableLink={true}
                    activeBtnStyles={'col-span-2 w-full '}
                    btnText='Associate Current Address'
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
