import { TRANSFERRING, SUCCESS } from '../../FundStore/ApproveFundState';
import { useContext } from 'react';
import StoreContext from '../../../../store/Store/StoreContext';
import FundContext from '../../FundStore/FundContext';
import useWeb3 from '../../../../hooks/useWeb3';
import { getBigNumberVol } from '../../../../services/utils/lib';

const useFundBounty = () => {
  const [appState] = useContext(StoreContext);
  const [fundState, fundDispatch] = useContext(FundContext);
  const { bounty, token, volume, depositPeriodDays, refreshBounty } = fundState;
  const { library, account } = useWeb3();
  const { openQClient, logger, accountData } = appState;
  const bigNumberVolumeInWei = getBigNumberVol(volume, token);
  const fundBounty = async () => {
    const transfferringDispatch = {
      type: 'SET_APPROVE_TRANSFER_STATE',
      payload: TRANSFERRING,
    };
    fundDispatch(transfferringDispatch);
    try {
      console.log(
        library,
        bounty.bountyAddress,
        token.address,
        bigNumberVolumeInWei,
        depositPeriodDays,
        accountData.id,
        'fundTxnReceipt'
      );

      let fundTxnReceipt;
      fundTxnReceipt = await openQClient.fundBounty(
        library,
        bounty.bountyAddress,
        token.address,
        bigNumberVolumeInWei,
        depositPeriodDays,
        accountData.id
      );
      const transactionDispatch = {
        type: 'SET_TRANSACTION_HASH',
        payload: fundTxnReceipt.events[0].transactionHash,
      };
      fundDispatch(transactionDispatch);

      const successDispatch = {
        type: 'SET_APPROVE_TRANSFER_STATE',
        payload: SUCCESS,
      };
      fundDispatch(successDispatch);
      //  setSuccessMessage(`Successfully funded issue ${bounty.url} with ${volume} ${token.symbol}!`);
      refreshBounty();
    } catch (error) {
      logger.error(error, account, bounty.id);
      const { message, title } = openQClient.handleError(error);
      const errorDispatch = {
        type: 'SET_ERROR',
        payload: { message, title },
        id: 'useFundBounty1',
      };
      fundDispatch(errorDispatch);
    }
  };
  return fundBounty;
};
export default useFundBounty;
