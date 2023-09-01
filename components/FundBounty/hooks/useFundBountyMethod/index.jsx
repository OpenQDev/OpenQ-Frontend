import useFundBounty from '../useFundBounty';
import useCheckAddressLimit from '../useCheckAddressLimit';
import useCheckAccountBalance from '../useCheckAccountBalance';
import useApprove from '../useApprove';
import StoreContext from '../../../../store/Store/StoreContext';
import { useContext } from 'react';

const useFundBountyMethod = () => {
  const [appState] = useContext(StoreContext);
  const { logger } = appState;
  const fundBounty = useFundBounty();
  const checkAddressLimit = useCheckAddressLimit();
  const checkAccountBalance = useCheckAccountBalance();
  const approve = useApprove();
  // funding token process when no NFT added
  const fundBountyMethod = async () => {
    try {
      checkAddressLimit();
      const hasAccountBalance = await checkAccountBalance();

      if (!hasAccountBalance) {
        return;
      }

      const approveSucceeded = await approve();
      if (approveSucceeded) {
        fundBounty();
      }
    } catch (error) {
      logger.error(error, 'useFundBountyMethod1');
    }
  };

  return fundBountyMethod;
};
export default useFundBountyMethod;
