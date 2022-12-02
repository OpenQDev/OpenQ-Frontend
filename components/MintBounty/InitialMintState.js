const zeroAddressMetadata = {
  name: 'Matic',
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'MATIC',
  decimals: 18,
  chainId: 80001,
  path: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
};

const InitialMintState = {
  finalTierVolumesState: [1, 1, 1],
  payoutVolumeState: '',
  payoutTokenState: zeroAddressMetadata,
  enableRegistrationState: false,
  registrationDeadlineState: null,
  startDateState: null,
  enableContestState: false,
  enableContest: false,
  goalVolume: '',
  goalToken: zeroAddressMetadata,
};

export default InitialMintState;
