const starOrganization = async (account, id, starred, setStarred, setStarredDisabled, context) => {
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
    setStarredDisabled(true);
    if (starred) {
      await appState.openQPrismaClient.unStarOrg(id, account);
      setStarred(false);
      setStarredDisabled(false);
    } else {
      await appState.openQPrismaClient.starOrg(id, account);
      setStarred(true);
      setStarredDisabled(false);
    }

    const payload = {
      type: 'RELOAD_NOW',
      payload: Date.now(),
    };

    dispatch(payload);
  } catch (error) {
    appState.logger.error(error, undefined, 'starOrganizations1');
  }
};
export default starOrganization;
