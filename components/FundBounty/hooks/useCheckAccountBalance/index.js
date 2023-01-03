import { useContext } from 'react';
import StoreContext from '../../../../store/Store/StoreContext';
import FundContext from '../../FundStore/FundContext';
import useWeb3 from '../../../../hooks/useWeb3';
import { getBigNumberVol } from '../../../../services/utils/lib';

const useCheckAccountBalance = () => {
  const [appState] = useContext(StoreContext);
  const [fundState, fundDispatch] = useContext(FundContext);
  const { bounty, token, volume } = fundState;
  const bigNumberVolumeInWei = getBigNumberVol(volume, token);
  const { account, library } = useWeb3();
  const { openQClient, logger } = appState;
  const checkAccountBalance = async () => {
    let dispatchedError = null;
    try {
      const callerBalance = await openQClient.balanceOf(library, account, token.address);
      if (callerBalance.noSigner) {
        dispatchedError = {
          title: 'No wallet connected.',
          message: 'Please connect your wallet.',
        };

        return;
      } else if (callerBalance.lt(bigNumberVolumeInWei)) {
        dispatchedError = {
          title: 'Funds Too Low',
          message: 'You do not have sufficient funds for this deposit',
        };
      }
    } catch (error) {
      logger.error(error, account, bounty.id);
      dispatchedError = {
        title: 'Call Revert Exception',
        message: 'A contract call exception occurred. Please try again.',
      };
    }
    if (dispatchedError) {
      const errorDispatch = {
        type: 'SET_ERROR',
        payload: dispatchedError,
        id: 'useCheckAccountBalance1',
      };

      await fundDispatch(errorDispatch);
      return;
    } else {
      return true;
    }
  };

  return checkAccountBalance;
};

export default useCheckAccountBalance;
