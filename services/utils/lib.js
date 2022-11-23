export const getNonBlacklisted = async (appState, repoName, org, limit) => {
  const { repoPrs, totalCount } = await appState.githubRepository.getPrs(org, repoName, limit || 3);

  const prs = await appState.openQPrismaClient.getPullRequests();
  const blacklistedPrIds = prs.filter((pr) => pr.blacklisted).map((pr) => pr.prId);

  return { nonBlacklisted: repoPrs.filter((pr) => !blacklistedPrIds.includes(pr.id)), totalCount };
};
