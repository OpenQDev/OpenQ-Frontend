import { ethers } from 'ethers';

const watchBounty = async (context, github, email, id, bounty, watchingDisplay, setWatchingDisplay) => {
  const promise = new Promise(async (resolve, reject) => {
    const [appState, dispatch] = context;
    let idObj = {};
    if (github) {
      idObj.github = github;
    }
    if (email) {
      idObj.email = email;
    }
    if (id) {
      idObj.userId = id;
    }

    try {
      if (watchingDisplay) {
        await appState.openQPrismaClient.unWatchBounty(ethers.utils.getAddress(bounty.bountyAddress), idObj);
        setWatchingDisplay(false);
      } else {
        await appState.openQPrismaClient.watchBounty(ethers.utils.getAddress(bounty.bountyAddress), idObj);
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
