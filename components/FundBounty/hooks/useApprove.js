import { useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import FundContext from '../FundContext';
import { ethers } from 'ethers';
import useWeb3 from '../../../hooks/useWeb3';
import { getBigNumberVol } from '../../../services/utils/lib';

const useApprove = () => {
  const [appState] = useContext(StoreContext);
  const { openQClient } = appState;
  const [fundState, fundDispatch] = useContext(FundContext);
  const { bounty, token, volume, allowance, pickedNft } = fundState;
  const bigNumberVolumeInWei = getBigNumberVol(volume, token);
  const { library } = useWeb3();

  const approve = async () => {
    if (allowance && !pickedNft) {
      return true;
    }
    try {
      if (token.address != ethers.constants.AddressZero && !allowance) {
        const approveDispatch = {
          type: 'SET_APPROVING',
        };
        fundDispatch(approveDispatch);
        console.log('executeing');
        if (pickedNft) {
          console.log(bounty.bountyAddress, pickedNft.token_address, pickedNft.token_id, 'pickedNfts');
          await openQClient.approveNFT(library, bounty.bountyAddress, pickedNft.token_address, pickedNft.token_id);
        } else {
          console.log('no nft');
          console.log('no nft', bounty.bountyAddress, token.address, bigNumberVolumeInWei);

          await openQClient.approve(library, bounty.bountyAddress, token.address, bigNumberVolumeInWei);
        }
      }
      return true;
    } catch (error) {
      const errorPayload = openQClient.handleError(error, { bounty });
      const errorDispatch = {
        type: 'SET_ERROR',
        payload: errorPayload,
        id: 'useApprove1',
      };
      fundDispatch(errorDispatch);
    }
  };

  return approve;
};

export default useApprove;
