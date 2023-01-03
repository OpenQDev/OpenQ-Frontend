const zeroAddressMetadata = {
  name: 'Matic',
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'MATIC',
  decimals: 18,
  chainId: 80001,
  path: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
};

// Reminder, this isn't all the props fundState has, just the initial ones.
const InitialTokenState = {
  showApproveTransferModal: false,
  volume: '',
  token: zeroAddressMetadata,
  nftTier: '',
  allowance: '',
  successMessage: '',
  depositPeriodDays: 30,
  error: '',
  transactionHash: '',
  approveTransferState: 'RESTING',
};

export default InitialTokenState;
