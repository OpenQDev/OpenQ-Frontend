import { hookRender, waitFor } from '../../../../test-utils';
import useApprove from '.';
import InitialState from '../../../../store/Store/InitialState';
import InitialFundState from '../../FundStore/InitialFundState';
import Constants from '../../../../test-utils/constant';
import { BigNumber } from 'ethers';

describe('useApprove', () => {
  it('should approve', async () => {
    await waitFor(async () => {
      const approveMock = jest.fn();
      const errorMock = jest.fn();
      const customInitialState = {
        ...InitialState,
        openQClient: { ...InitialState.openQClient, approve: approveMock, handleError: errorMock },
      };
      const customFundState = {
        ...InitialFundState,
        approveTransferState: 'CONFIRM',
        showApproveTransferModal: true,
        volume: '3',
        bounty: Constants.bounty,
        token: { address: Constants.daiAddress, ...Constants.tokenMetadata },
      };
      const { result } = hookRender(() => useApprove(), {}, customInitialState, {}, customFundState);
      const approveFunc = result.current;
      await approveFunc();
      const bigNumber = BigNumber.from('3000000000000000000');
      expect(customInitialState.openQClient.approve).toHaveBeenCalledWith(
        {},
        Constants.bounty.bountyAddress,
        Constants.daiAddress,
        bigNumber
      );
    });
  });
  it('should reject if missing address', async () => {
    await waitFor(async () => {
      const errorMock = jest.fn();
      const customInitialState = {
        ...InitialState,
        openQClient: { ...InitialState.openQClient, handleError: errorMock },
      };
      const customFundState = {
        ...InitialFundState,
        approveTransferState: 'CONFIRM',
        showApproveTransferModal: true,
        volume: '3',
        token: { decimals: 2 },
      };
      const { result } = hookRender(() => useApprove(), {}, customInitialState, {}, customFundState);
      const approveFunc = result.current;
      await approveFunc();
      expect(customInitialState.openQClient.handleError).toHaveBeenCalled();
    });
  });
});
