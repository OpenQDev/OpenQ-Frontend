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

  info(data, user, id) {
    if (process.env.JEST_WORKER_ID) return; // ignore infos in tests (they are logged in the console
    if (this.enabled === 'DEV') {
      const { message } = data;
      const currentDate = new Date();
      // Must use JSON.stringify in each value in case it contains special characters

      if (message) {
        console.log(`id: ${id}, message: ${message}, date: ${currentDate}, user: ${user}`);
      } else {
        console.error('undefined error');
      }
    }
  }
  error(data, user, id) {
    if (process.env.JEST_WORKER_ID) return; // ignore errors in tests (they are logged in the console
    const { message } = data;
    if (this.enabled === 'PROD' || this.enabled === 'DEV') {
      const currentDate = new Date();
      // Must use JSON.stringify in each value in case it contains special characters
      if (message) {
        console.error(`id: ${id}, message: ${message}, date: ${currentDate}, userAddress: ${user}`);
      } else {
        console.error('undefined error');
      }
    }
  }
}

export default Logger;
