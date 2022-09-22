import { ethers } from 'ethers';

const watchBounty = async (context, account, bounty, watchingDisplay, setWatchingDisplay) => {
  const promise = new Promise(async (resolve, reject) => {
    const [appState, dispatch] = context;
    if (!account) {
      const payload = {
        type: 'CONNECT_WALLET',
        payload: true,
      };
      dispatch(payload);
      return;
    }
    try {
      const response = await appState.authService.hasSignature(account);
      if (response.data.status === false) {
        const signature = await appState.openQClient.signMessage(account);
        await appState.authService.verifySignature(account, signature);
      }

      if (watchingDisplay) {
        await appState.openQPrismaClient.unWatchBounty(ethers.utils.getAddress(bounty.bountyAddress), account);
        setWatchingDisplay(false);
      } else {
        await appState.openQPrismaClient.watchBounty(ethers.utils.getAddress(bounty.bountyAddress), account);
        setWatchingDisplay(true);
      }

      const payload = {
        type: 'RELOAD_NOW',
        payload: Date.now(),
      };
      dispatch(payload);
    } catch (err) {
      reject(err);
    }
    resolve();
  });
  return promise;
};

export default watchBounty;
