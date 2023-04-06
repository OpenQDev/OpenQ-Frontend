const zeroAddressMetadata = {
  name: 'Matic',
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'MATIC',
  decimals: 18,
  chainId: 80001,
  path: '/crypto-logos/MATIC.svg',
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
  kycRequired: false,
  supportingDocumentsRequired: false,
  alternativeName: '',
  alternativeLogo: '',
  goalVolume: '',
  altName: '',
  altUrl: '',
  goalToken: zeroAddressMetadata,
};

export default InitialMintState;
