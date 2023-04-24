import { ethers } from 'ethers';

const watchBounty = async (context, bounty, watchingDisplay, setWatchingDisplay) => {
  const promise = new Promise(async (resolve, reject) => {
    const [appState, dispatch] = context;

    try {
      if (watchingDisplay) {
        await appState.openQPrismaClient.unWatchBounty(ethers.utils.getAddress(bounty.bountyAddress));
        setWatchingDisplay(false);
      } else {
        await appState.openQPrismaClient.watchBounty(ethers.utils.getAddress(bounty.bountyAddress));
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
