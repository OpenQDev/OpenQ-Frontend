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
      console.error('info', message);
      // Must use JSON.stringify in each value in case it contains special characters
      console.error(
        JSON.parse(
          `{ "id": ${JSON.stringify(id)}, "message": ${JSON.stringify(message)}, "date": ${JSON.stringify(
            currentDate
          )}, "userAddress": ${JSON.stringify(user)} }`
        )
      );
    }
  }
  error(data, user, id) {
    if (process.env.JEST_WORKER_ID) return; // ignore errors in tests (they are logged in the console
    const { message } = data;
    if (this.enabled === 'PROD' || this.enabled === 'DEV') {
      const currentDate = new Date();
      console.error('error', message);
      // Must use JSON.stringify in each value in case it contains special characters
      console.error(
        JSON.parse(
          `{ "id": ${JSON.stringify(id)}, "message": ${JSON.stringify(message)}, "date": ${JSON.stringify(
            currentDate
          )}, "userAddress": ${JSON.stringify(user)} }`
        )
      );
    }
  }
}

export default Logger;
