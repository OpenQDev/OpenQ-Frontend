import { APPROVING, TRANSFERRING, SUCCESS, ERROR } from './ApproveFundState';

const checkAddressLimit = async (
  openQClient,
  library,
  token,
  bounty,
  setError,
  setApproveTransferState,
  setButtonText
) => {
  try {
    const isWhitelisted = await openQClient.isWhitelisted(library, token.address);

    // Only check bounty token address limit for non-whitelisted tokens
    if (!isWhitelisted) {
      const tokenAddressLimitReached = await openQClient.tokenAddressLimitReached(library, bounty.bountyAddress);
      if (tokenAddressLimitReached) {
        setError({
          title: 'Token Address Limit Is Reached!',
          message: 'Contact info@openq.dev',
        });
        setApproveTransferState(ERROR);
        return;
      }
    }
  } catch (error) {
    setError({
      title: 'Call Revert Exception',
      message: 'A contract call exception occurred. Please try again.',
    });
    setButtonText('Fund');
    setApproveTransferState(ERROR);
    return;
  }
};

const checkFundsBalance = async (
  openQClient,
  library,
  account,
  token,
  setError,
  setApproveTransferState,
  bigNumberVolumeInWei,
  logger,
  bounty,
  setButtonText
) => {
  try {
    const callerBalance = await openQClient.balanceOf(library, account, token.address);

    if (callerBalance.noSigner) {
      setError({
        title: 'No wallet connected.',
        message: 'Please connect your wallet.',
      });
      setApproveTransferState(ERROR);
      return;
    } else if (callerBalance.lt(bigNumberVolumeInWei)) {
      setError({
        title: 'Funds Too Low',
        message: 'You do not have sufficient funds for this deposit',
      });
      setApproveTransferState(ERROR);
      return;
    }
  } catch (error) {
    logger.error(error, account, bounty.id);
    setError({
      title: 'Call Revert Exception',
      message: 'A contract call exception occurred. Please try again.',
    });
    setButtonText('Fund');
    setApproveTransferState(ERROR);
    return;
  }
};

const approveToken = async (
  setShowApproveTransferModal,
  token,
  ethers,
  allowance,
  setButtonText,
  setApproveTransferState,
  openQClient,
  library,
  bounty,
  setError,
  bigNumberVolumeInWei
) => {
  try {
    setShowApproveTransferModal(true);
    if (token.address != ethers.constants.AddressZero && !allowance) {
      setButtonText('Approving');
      setApproveTransferState(APPROVING);
      await openQClient.approve(library, bounty.bountyAddress, token.address, bigNumberVolumeInWei);
    }
    return true;
  } catch (error) {
    const { message, title, link, linkText } = openQClient.handleError(error, { bounty });
    setError({ message, title, link, linkText });
    setButtonText('Fund');
    setApproveTransferState(ERROR);
  }
};

const fundBounty = async (
  setApproveTransferState,
  openQClient,
  library,
  bounty,
  token,
  bigNumberVolumeInWei,
  depositPeriodDays,
  setTransactionHash,
  setSuccessMessage,
  refreshBounty,
  logger,
  account,
  volume,
  setError,
  setButtonText
) => {
  setApproveTransferState(TRANSFERRING);
  try {
    const fundTxnReceipt = await openQClient.fundBounty(
      library,
      bounty.bountyAddress,
      token.address,
      bigNumberVolumeInWei,
      depositPeriodDays
    );
    setTransactionHash(fundTxnReceipt.events[0].transactionHash);
    setApproveTransferState(SUCCESS);
    setSuccessMessage(`Successfully funded issue ${bounty.url} with ${volume} ${token.symbol}!`);
    refreshBounty();
  } catch (error) {
    logger.error(error, account, bounty.id);
    const { message, title } = openQClient.handleError(error, {
      bounty,
    });
    setError({ message, title });
    setApproveTransferState(ERROR);
  }
  setButtonText('Fund');
};

const approveNFT = async (
  setShowApproveTransferModal,
  setButtonText,
  setApproveTransferState,
  openQClient,
  library,
  bounty,
  pickedNft,
  setError
) => {
  try {
    setShowApproveTransferModal(true);
    setButtonText('Approving');
    setApproveTransferState(APPROVING);

    await openQClient.approveNFT(library, bounty.bountyAddress, pickedNft.token_address, pickedNft.token_id);
    setApproveTransferState(TRANSFERRING);
  } catch (error) {
    const { message, title, link, linkText } = openQClient.handleError(error, { bounty });
    setError({ message, title, link, linkText });
    setButtonText('Fund');
    setApproveTransferState(ERROR);
  }
};

const fundBountyWithNft = async (
  pickedNft,
  library,
  openQClient,
  bounty,
  depositPeriodDays,
  setTransactionHash,
  setApproveTransferState,
  setButtonText,
  setSuccessMessage,
  refreshBounty,
  setError,
  error,
  token
) => {
  try {
    const { token_address, token_id } = pickedNft;
    const fundTxnReceipt = await openQClient.fundBountyWithNft(
      library,
      bounty.bountyAddress,
      token_address,
      token_id,
      depositPeriodDays
    );
    setTransactionHash(fundTxnReceipt.events[0].transactionHash);
    setApproveTransferState(SUCCESS);
    setButtonText('Fund');
    setSuccessMessage(
      `Successfully funded issue ${bounty.url} with ${pickedNft.name} #${pickedNft.token_id} (${pickedNft.metadata.name})${token.symbol}!`
    );
    refreshBounty();
  } catch (err) {
    const { message, title, link, linkText } = openQClient.handleError(error, { bounty });
    setError({ message, title, link, linkText });
    setButtonText('Fund');
    setApproveTransferState(ERROR);
  }
};

const fundBountyMethod = async (
  setError,
  setApproveTransferState,
  volume,
  token,
  ethers,
  pickedNft,
  openQClient,
  library,
  setButtonText,
  bounty,
  account,
  logger,
  setShowApproveTransferModal,
  allowance,
  depositPeriodDays,
  setTransactionHash,
  setSuccessMessage,
  refreshBounty,
  error
) => {
  const volumeInWei = volume * 10 ** token.decimals;
  const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toLocaleString('fullwide', { useGrouping: false }));

  // funding token process when no NFT added
  if (!pickedNft) {
    checkAddressLimit(openQClient, library, token, bounty, setError, setApproveTransferState, setButtonText);

    checkFundsBalance(
      openQClient,
      library,
      account,
      token,
      setError,
      setApproveTransferState,
      bigNumberVolumeInWei,
      logger,
      bounty,
      setButtonText
    );

    const approveSucceeded = approveToken(
      setShowApproveTransferModal,
      token,
      ethers,
      allowance,
      setButtonText,
      setApproveTransferState,
      openQClient,
      library,
      bounty,
      setError
    );

    if (approveSucceeded || allowance) {
      fundBounty(
        setApproveTransferState,
        openQClient,
        library,
        bounty,
        token,
        bigNumberVolumeInWei,
        depositPeriodDays,
        setTransactionHash,
        setSuccessMessage,
        refreshBounty,
        logger,
        account,
        volume,
        setError,
        setButtonText
      );
    }
  } else {
    // funding token process with an NFT
    approveNFT(
      setShowApproveTransferModal,
      setButtonText,
      setApproveTransferState,
      openQClient,
      library,
      bounty,
      pickedNft,
      setError
    );
    fundBountyWithNft(
      pickedNft,
      library,
      openQClient,
      bounty,
      depositPeriodDays,
      setTransactionHash,
      setApproveTransferState,
      setButtonText,
      setSuccessMessage,
      refreshBounty,
      setError,
      error,
      token
    );
  }
};
export default fundBountyMethod;
