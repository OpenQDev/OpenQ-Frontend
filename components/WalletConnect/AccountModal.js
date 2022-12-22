// Third party
import React, { useContext } from 'react';
// Custom
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import { SignOutIcon } from '@primer/octicons-react';
import StoreContext from '../../store/Store/StoreContext';
import { metaMask, walletConnect } from '../WalletConnect/connectors';
import useWeb3 from '../../hooks/useWeb3';
import useEns from '../../hooks/useENS';

const AccountModal = ({ setIsConnecting, domRef, showModal }) => {
  const { chainId, account, safe } = useWeb3();
  const [ensName] = useEns(account);
  let networkName;
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  for (let key in chainIdDeployEnvMap) {
    if (chainIdDeployEnvMap[key].chainId === chainId) {
      networkName = chainIdDeployEnvMap[key].networkName;
    }
  }
  const disconnectAccount = () => {
    const connectors = [walletConnect, metaMask];
    try {
      connectors.forEach((connector) => {
        if (connector?.deactivate) {
          connector.deactivate();
        } else {
          connector.resetState();
        }
      });
    } catch (error) {
      appState.logger.error(error, accountData.id, 'AccountModal.js1');
    }
    setIsConnecting(false);
  };
  if (!showModal) return <div></div>;
  return (
    <div className='flex mr-4 flex-col items-center'>
      <div className='flex -mt-2 md:-mt-2 border-b-gray-700 tooltip-triangle absolute'></div>
      <div className='flex z-10 -mt-1.5 md:-mt-1.5 border-b-[#161B22] tooltip-triangle absolute'></div>

      <div
        ref={domRef}
        className='flex absolute flex-col mt-0 z-[5] bg-[#161B22] w-40 tooltip border-gray-700 border rounded-sm p-0'
      >
        <div className='flex text-[#c9d1d9] items-center w-full h-8 p-2 mt-2 ml-2 m-0'>{networkName}</div>

        <div className='flex md:hover:bg-[#1f6feb] w-full gap-4 items-center hover:text-white text-[#c9d1d9]'>
          <div className='flex flex-col w-full p-2 ml-2'>
            <span className='text-left'>{ensName}</span>
            <CopyAddressToClipboard data={account} clipping={[5, 38]} />
          </div>
        </div>

        {!safe && (
          <div className='flex flex-col w-full'>
            <button
              className='flex md:hover:bg-[#1f6feb] h-8 w-full items-center hover:text-white text-[#c9d1d9] self-start gap-4  p-2 mb-2'
              onClick={disconnectAccount}
            >
              <SignOutIcon className='w-4 h-4 ml-2 ' />
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default AccountModal;
