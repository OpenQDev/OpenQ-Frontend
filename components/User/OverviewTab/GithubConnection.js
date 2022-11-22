// Third party
import React, { useContext, useEffect, useState } from 'react';

// Custom
import ShieldCheck from '../../svg/shieldCheck';
import StoreContext from '../../../store/Store/StoreContext';
import useAuth from '../../../hooks/useAuth';
import AuthButton from '../../Authentication/AuthButton';
import Chain from '../../svg/chain';
import useWeb3 from '../../../hooks/useWeb3';
import AssociateModal from '../GithubRegistration/AssociateModal';

const GithubConnection = ({ user }) => {
  const [appState] = useContext(StoreContext);
  const { account } = useWeb3();
  const isOwner = user.id?.toLowerCase() === account?.toLowerCase();
  console.log('isOwner', isOwner, account, user.id);
  const [authState] = useAuth();
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
                  {externalUserId === githubId
                    ? 'Signed in Github profile associated with address on chain.'
                    : externalUserId && githubId
                    ? 'Another Github profile is associated with address on chain.'
                    : !githubId
                    ? 'Github profile not signed in.'
                    : 'No Github profile associated with address on chain.'}
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