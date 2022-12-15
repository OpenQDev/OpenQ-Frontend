const starOrganization = async (
  github,
  email,
  userId,
  organizationId,
  starred,
  setStarred,
  setStarredDisabled,
  context
) => {
  const [appState, dispatch] = context;

  try {
    setStarredDisabled(true);
    const variables = {
      ...(github && { github }),
      ...(email && { email }),
      userId,
      organizationId,
    };
    if (starred) {
      await appState.openQPrismaClient.unStarOrg(variables);
      setStarred(false);
      setStarredDisabled(false);
    } else {
      await appState.openQPrismaClient.starOrg(variables);
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
