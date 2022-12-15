const zeroAddressMetadata = {
  name: 'Matic',
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'MATIC',
  decimals: 18,
  chainId: 80001,
  path: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
};

const InitialMintState = {
  finalTierVolumes: [1, 1, 1],
  isLoading: false,
  payoutVolume: '',
  payoutToken: zeroAddressMetadata,
  enableRegistration: false,
  registrationDeadline: null,
  startDate: null,
  sum: 0,
  hideModal: false,
  invoiceable: false,
  goalVolume: '',
  goalToken: zeroAddressMetadata,
};

export default InitialMintState;
