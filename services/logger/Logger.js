class Logger {
  enabled;

  constructor(_enabled) {
    this.enabled = _enabled;
    if (process.env.DEPLOY_ENV) {
      if (process.env.DEPLOY_ENV !== 'production') {
        this.enabled = 'DEV';
      } else {
        this.enabled = 'PROD';
      }
    }
  }

  info(data, account, id) {
    if (process.env.JEST_WORKER_ID) return; // ignore infos in tests (they are logged in the console
    if (this.enabled === 'DEV') {
      const { message } = data;
      const currentDate = new Date();
      console.log(`id: ${id}, message: ${message}, date: ${currentDate}, userAddress: ${account}`);
    }
  }
  error(data, account, id) {
    if (process.env.JEST_WORKER_ID) return; // ignore errors in tests (they are logged in the console
    const { message } = data;
    if (this.enabled === 'PROD' || this.enabled === 'DEV') {
      const currentDate = new Date();
      console.error(`id: ${id}, message: ${message}, date: ${currentDate}, userAddress: ${account}`);
    }
  }
}

export default Logger;
