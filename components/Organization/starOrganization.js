const starOrganization = async (organizationId, starred, setStarred, setStarredDisabled, context) => {
  const [appState, dispatch] = context;

  try {
    setStarredDisabled(true);

    if (starred) {
      await appState.openQPrismaClient.unStarOrg({ organizationId });
      setStarred(false);
      setStarredDisabled(false);
    } else {
      await appState.openQPrismaClient.starOrg({ organizationId });
      setStarred(true);
      setStarredDisabled(false);
    }

    const payload = {
      type: 'RELOAD_NOW',
      payload: Date.now(),
    };

    dispatch(payload);
  } catch (error) {
    appState.logger.error(error, appState?.accountData?.id, 'starOrganizations1');
  }
};
export default starOrganization;
