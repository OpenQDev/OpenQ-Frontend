import { hookRender, waitFor } from '../../../../test-utils';
import useFundBountyMethod from '.';
import InitialState from '../../../../store/Store/InitialState';
import InitialFundState from '../../FundStore/InitialFundState';
import Constants from '../../../../test-utils/constant';

describe('useFundMethod', () => {
  it('should approve and fund normal bounties', async () => {
    await waitFor(async () => {
      const approveMock = jest.fn();
      const fundMock = jest.fn();
      const errorMock = jest.fn();
      const fundBountyCombined = () => {
        fundMock();
        return InitialState.openQClient.fundBounty();
      };
      const customInitialState = {
        ...InitialState,
        openQClient: {
          ...InitialState.openQClient,
          approve: approveMock,
          handleError: errorMock,
          fundBounty: fundBountyCombined,
        },
      };
      const customFundState = {
        ...InitialFundState,
        approveTransferState: 'CONFIRM',
        refreshBounty: jest.fn(),
        showApproveTransferModal: true,
        volume: '3',
        bounty: Constants.bounty,
        token: { address: Constants.daiAddress, ...Constants.tokenMetadata },
      };
      const { result } = hookRender(() => useFundBountyMethod(), {}, customInitialState, {}, customFundState);
      const fundMethodFunc = result.current;
      await fundMethodFunc();
      expect(approveMock).toHaveBeenCalled();
      expect(fundMock).toHaveBeenCalled();
    });
  });

  it('should reject if missing address', async () => {
    await waitFor(async () => {
      const approveMock = jest.fn();
      const fundMock = jest.fn();
      const errorMock = jest.fn();
      const fundBountyCombined = () => {
        fundMock();
        return InitialState.openQClient.fundBounty();
      };
      const customInitialState = {
        ...InitialState,
        openQClient: {
          ...InitialState.openQClient,
          approve: approveMock,
          handleError: errorMock,
          fundBounty: fundBountyCombined,
        },
      };
      const customFundState = {
        ...InitialFundState,
        approveTransferState: 'CONFIRM',
        showApproveTransferModal: true,
        volume: '3',
        token: { decimals: 18 },
      };
      const { result } = hookRender(() => useFundBountyMethod(), {}, customInitialState, {}, customFundState);
      const fundMethodFunc = result.current;
      await fundMethodFunc();
      expect(errorMock).toHaveBeenCalled();
    });
  });
});
