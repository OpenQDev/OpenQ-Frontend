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
  ERROR,
  account,
  logger,
  setShowApproveTransferModal,
  allowance,
  APPROVING,
  depositPeriodDays,
  setTransactionHash,
  TRANSFERRING,
  SUCCESS,
  setSuccessMessage,
  refreshBounty,
  error
) => {
  const volumeInWei = volume * 10 ** token.decimals;

  const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toLocaleString('fullwide', { useGrouping: false }));

  let approveSucceeded = false;

  if (!pickedNft) {
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
    try {
      setShowApproveTransferModal(true);
      if (token.address != ethers.constants.AddressZero && !allowance) {
        setButtonText('Approving');
        setApproveTransferState(APPROVING);
        await openQClient.approve(library, bounty.bountyAddress, token.address, bigNumberVolumeInWei);
      }
      approveSucceeded = true;
    } catch (error) {
      const { message, title, link, linkText } = openQClient.handleError(error, { bounty });
      setError({ message, title, link, linkText });
      setButtonText('Fund');
      setApproveTransferState(ERROR);
    }
    if (approveSucceeded || allowance) {
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
    }
  } else {
    try {
      setShowApproveTransferModal(true);
      setButtonText('Approving');
      setApproveTransferState(APPROVING);

      await openQClient.approveNFT(library, bounty.bountyAddress, pickedNft.token_address, pickedNft.token_id);

      approveSucceeded = true;
      setApproveTransferState(TRANSFERRING);
    } catch (error) {
      const { message, title, link, linkText } = openQClient.handleError(error, { bounty });
      setError({ message, title, link, linkText });
      setButtonText('Fund');
      setApproveTransferState(ERROR);
    }

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
  }
};
export default fundBountyMethod;
