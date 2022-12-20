import useFundBounty from './useFundBounty';
import useCheckAddressLimit from './useCheckAddressLimit';
import useCheckAccountBalance from './useCheckAccountBalance.js';
import useApprove from './useApprove.js';
import FundContext from '../FundContext';
import { useContext } from 'react';

const useFundBountyMethod = () => {
  const [fundState] = useContext(FundContext);
  const { pickedNft } = fundState;
  const fundBounty = useFundBounty();
  const checkAddressLimit = useCheckAddressLimit();
  const checkAccountBalance = useCheckAccountBalance();
  const approve = useApprove();
  // funding token process when no NFT added
  const fundBountyMethod = async () => {
    if (!pickedNft) {
      checkAddressLimit();
      const hasAccountBalance = await checkAccountBalance();
      if (!hasAccountBalance) {
        console.log('exec');
        return;
      }
    }
    const approveSucceeded = await approve();

    if (approveSucceeded) {
      fundBounty();
    }
  };

  return fundBountyMethod;
};
export default useFundBountyMethod;
