// Third party
import React, { useContext } from 'react';
import Link from 'next/link';
// Custom
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import { PersonIcon, SignOutIcon } from '@primer/octicons-react';
import StoreContext from '../../store/Store/StoreContext';
import { metaMask, walletConnect } from '../WalletConnect/connectors';

const AccountModal = ({ chainId, account, ensName, setIsConnecting, domRef, isSafeApp }) => {
  let networkName;
  const [appState, dispatch] = useContext(StoreContext);
  const { accountData } = appState;
  for (let key in chainIdDeployEnvMap) {
    if (chainIdDeployEnvMap[key].chainId === chainId) {
      networkName = chainIdDeployEnvMap[key].networkName;
    }
  }
  const disconnectAccount = () => {
    const updateSignedAccount = async (signedAccount) => {
      const payload = {
        type: 'SET_SIGNED_ACCOUNT',
        payload: signedAccount,
      };
      dispatch(payload);
    };
    const connectors = [walletConnect, metaMask];
    try {
      connectors.forEach((connector) => {
        if (connector?.deactivate) {
          connector.deactivate();
        } else {
          connector.resetState();
        }
        appState.authService.hasSignature(null);
        updateSignedAccount(null);
      });
    } catch (err) {
      appState.logger.error(err, account);
    }
    setIsConnecting(false);
  };

  {
    /* useEffect(() => {
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(32, parseInt(account.slice(2, 10), 16)));
		}
	}, [account]); */
  }

  return (
    <div className='flex mr-4 flex-col items-center'>
      <div className='flex -mt-2 md:-mt-2 border-b-gray-700 tooltip-triangle absolute'></div>
      <div className='flex z-40 -mt-1.5 md:-mt-1.5 border-b-[#161B22] tooltip-triangle absolute'></div>

      <div
        ref={domRef}
        className='flex absolute flex-col mt-0 z-30 bg-[#161B22] w-40 tooltip border-gray-700 border rounded-sm p-0'
      >
        <div className='flex text-[#c9d1d9] items-center w-full h-8 p-2 mt-2 ml-2 m-0'>{networkName}</div>

        <div className='flex md:hover:bg-[#1f6feb] w-full gap-4 items-center hover:text-white text-[#c9d1d9]'>
          <div className='flex flex-col w-full p-2 ml-2'>
            <span className='text-left'>{ensName}</span>
            <CopyAddressToClipboard data={account} clipping={[5, 38]} />
          </div>
        </div>

        {!isSafeApp && (
          <div className='flex flex-col w-full'>
            <button
              className='flex md:hover:bg-[#1f6feb] h-8 w-full items-center hover:text-white text-[#c9d1d9] self-start gap-4  p-2'
              onClick={disconnectAccount}
            >
              <SignOutIcon className='w-4 h-4 ml-2 ' />
              <span>Disconnect</span>
            </button>
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/${accountData.id}`} className=''>
              <div
                data-testid='link'
                className='flex md:hover:bg-[#1f6feb] h-8 items-center w-full cursor-pointer hover:text-white text-[#c9d1d9] self-start gap-4 p-2 mb-2'
              >
                <PersonIcon className='w-4 h-4 ml-2' />
                <span>Profile</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default AccountModal;
