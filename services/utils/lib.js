import { ethers } from 'ethers';

export const getNonBlacklisted = async (appState, repoName, org, limit) => {
  const { repoPrs, totalCount } = await appState.githubRepository.getPrs(org, repoName, limit || 3);

  const prs = await appState.openQPrismaClient.getSubmissions();
  const blacklistedPrIds = prs.filter((pr) => pr.blacklisted).map((pr) => pr.id);

  return { nonBlacklisted: repoPrs.filter((pr) => !blacklistedPrIds.includes(pr.id)), totalCount };
};

export const shortenAddress = (address) => {
  if (!address) {
    return '';
  }
  return `${address.slice(0, 4)}...${address.slice(38)}`;
};

export const parseVolume = (volume) => {
  const numberRegex = /^(\d+)?(\.)?(\d+)?$/;
  if (numberRegex.test(volume) || volume === '' || volume === '.') {
    return volume.match(numberRegex)[0];
  } else {
    return null;
  }
};
export const listWordsWithAnd = (words) => {
  if (words.length === 0) return '';
  if (words.length === 1) {
    return words[0];
  }
  if (words.length === 2) {
    return `${words[0]} and ${words[1]}`;
  }
  return `${words.slice(0, -1).join(', ')}, and ${words[words.length - 1]}`;
};

export const capitalize = (word) => {
  if (!word) return '';
  return word[0].toUpperCase() + word.substring(1);
};
export const valueToDisplay = (value) => {
  switch (value) {
    case 'invoicingName':
      return 'Invoicing Name';
    case 'invoicingEmail':
      return 'Invoicing Email';
    case 'streetAddress':
      return 'Billing Address';
    case 'postalCode':
      return 'Postal Code';
    case 'phoneNumber':
      return 'Phone Number';
    case 'invoiceNumber':
      return 'Invoice Number';
    case 'taxId':
      return 'Tax ID';
    case 'vatNumber':
      return 'VAT Number';
    case 'vatRate':
      return 'VAT Rate';
    case 'billingName':
      return 'Billing Name';
    default:
      return capitalize(value);
  }
};

export const getBigNumberVol = (volume, token) => {
  const volumeFloat = parseFloat(volume) || 0;
  const volumeInWei = volumeFloat * 10 ** token.decimals;

  return ethers.BigNumber.from(volumeInWei.toLocaleString('fullwide', { useGrouping: false }));
};

export const checkHackathonDates = (startDate, endDate, today) => {
  const start = startDate && new Date(startDate);
  const end = endDate && new Date(endDate);
  if ((start && start < today) || (end && end < today) || (start && end && end < start)) {
    return false;
  }
  return true;
};
const checkPrUsed = (pr, bounty) => {
  return bounty.claims?.some((claim) => claim.claimantAsset === pr.source.url);
};
const checkTierClaimed = (bounty, index) => {
  return bounty.claims?.some((claim) => claim.tier === index.toString());
};

export const checkFixedAndSplit = (bounty, currentUser) => {
  if (
    bounty.status == '0' &&
    bounty?.prs?.some((pr) => pr.source.merged && pr.source.author.id === currentUser && checkPrUsed(pr, bounty))
  )
    return { status: 'Claimed' };
  if (bounty.status == '0' && bounty?.prs?.some((pr) => pr.source.merged && pr.source.author.id === currentUser)) {
    return { status: 'Claimable' };
  }
  return { status: null };
};

export const getWinningPrOfUser = (bounty, currentUser) => {
  if (bounty?.tierWinners?.some((winner, index) => winner === currentUser && checkTierClaimed(bounty, index))) {
    const winningPr = bounty?.prs?.find((pr) => pr.source.author.id === currentUser);

    return winningPr.source;
  }
};

export const checkTiered = (bounty, currentUser) => {
  if (bounty?.tierWinners?.some((winner, index) => winner === currentUser && checkTierClaimed(bounty, index))) {
    return { status: 'Claimed' };
  }

  if (bounty?.tierWinners?.some((winner) => winner === currentUser)) {
    return { status: 'Claimable' };
  }
  return { status: null };
};

export const checkClaimable = (bounty, currentUser) => {
  bounty.bountyType === '0';
  switch (bounty.bountyType) {
    case '0': {
      return checkFixedAndSplit(bounty, currentUser);
    }
    case '1': {
      return checkFixedAndSplit(bounty, currentUser);
    }
    case '2': {
      return checkTiered(bounty, currentUser);
    }
    case '3': {
      return checkTiered(bounty, currentUser);
    }
    default:
      return { status: null };
  }
};

export const getBountyMarker = (bounty, openQClient, githubId, checkClaimableImpl = checkClaimable) => {
  if (bounty.closed) return { status: 'Closed', colour: 'bg-danger', fill: 'fill-danger' };
  const { status } = checkClaimableImpl(bounty, githubId, openQClient);
  if (status === 'Claimable') {
    return {
      status: 'Claim Available',
      colour: 'bg-closed',
      fill: 'fill-closed',
    };
  }
  if (status === 'Claimed') {
    return {
      status: 'Claimed',
      colour: 'bg-closed',
      fill: 'fill-closed',
    };
  }
  if (bounty.bountyType === '0') {
    if (bounty.assignees[0]) {
      return {
        status: 'In Progress',
        colour: 'bg-yellow-500 text-black fill-black',
        fill: 'fill-yellow-500',
      };
    }
    return {
      status: 'Ready for Work',
      colour: 'bg-green',
      fill: 'fill-green',
    };
  } else {
    // for split price and contests, closed when status is 1
    if (bounty.status == '1') {
      return { status: 'Closed', colour: 'bg-danger', fill: 'fill-danger' };
    } else {
      return { status: 'Open', colour: 'bg-green', fill: 'fill-green' };
    }
  }
};

export const getPlural = (count) => {
  if (count > 1 || count === 0) {
    return 's';
  }
  return '';
};

export const getBool = (value) => {
  if (value === 'Yes') {
    return true;
  }
  return false;
};
export const reverseBool = (value) => {
  if (value === true) {
    return 'Yes';
  }
  return 'No';
};

export const getW8Approved = (bounty, accountData) => {
  if (!bounty.supportingDocumentsCompleted) return bounty.supportingDocumentsCompleted;
  if (bounty.bountyType === '2' || bounty.bountyType === '3') {
    return bounty.supportingDocumentsCompleted[bounty.tierWinners?.indexOf(accountData.github)];
  } else {
    return bounty.supportingDocumentsCompleted;
  }
};

export const isContest = (bounty) => {
  return bounty.bountyType === '2' || bounty.bountyType === '3';
};

export const isEveryValueNotNull = (obj) => {
  if (!obj) return false;
  const { kyc, w8Form, githubHasWallet, invoice } = obj;
  return kyc && w8Form && githubHasWallet && invoice;
};
export const formatVolume = (tierVolume, token) => {
  let bigNumberVolume = ethers.BigNumber.from(tierVolume.toString());
  let decimals = parseInt(token?.decimals) || 18;
  let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
  return formattedVolume;
};

export const fetchRequestsWithServiceArg = async (appState, identity, oldCursor, batch) => {
  const { userId, githubId, email } = identity;
  const userOffChainData = await appState.openQPrismaClient.getUserRequests(
    {
      id: userId,
      github: githubId,
      email: email,
    },
    {
      bountiesCursor: oldCursor,
      bountiesLimit: batch,
    }
  );
  const createdBounties = userOffChainData.createdBounties.bountyConnection.nodes.filter((bounty) => {
    return bounty.requests;
  });
  const requests = createdBounties
    .map((bounty) => {
      const requests = bounty.requests.nodes.reduce((accum, request) => {
        const user = accum.find(
          (earlierRequest) => earlierRequest.request.requestingUser.id === request.requestingUser.id
        );

        if (!user) {
          return accum.concat({ request, bounty });
        } else return accum;
      }, []);
      return requests;
    })
    .flat();
  return {
    nodes: requests,
    cursor: userOffChainData.createdBounties.bountyConnection.cursor,
    complete: createdBounties.length !== batch,
  };
};

export const fetchBountiesWithServiceArg = async (appState, oldCursor, batch, ordering, filters) => {
  let { sortOrder, field } = ordering;
  if (!sortOrder) {
    sortOrder = 'desc';
  }
  if (!field) {
    field = 'createdAt';
  }
  const { types, organizationId, repositoryId } = filters;

  try {
    let [fullBounties, cursor, complete] = await appState.utils.fetchBounties(
      appState,
      batch,
      types,
      sortOrder,
      field,
      oldCursor,
      organizationId,
      null,
      null,
      repositoryId
    );
    return {
      nodes: fullBounties,
      cursor,
      complete,
    };
  } catch (err) {
    appState.logger.error(err);
    return { nodes: [], cursor: null, complete: true };
  }
};

export const getReadyText = (isContest) => {
  if (isContest) {
    return 'Ready to Hack';
  } else return 'Ready for Work';
};
export const isOnlyContest = (types) => {
  const includesContest = types.includes('2') || types.includes('3');
  const includesNonContest = types.includes('0') || types.includes('1');
  return includesContest && !includesNonContest;
};

export const fetchRepositories = async (appState, variables) => {
  try {
    const repositories = await appState.openQPrismaClient.getRepositories(variables);

    const checkBlacklisted = (repository) => {
      const organizationBlacklisted = repository.organization.blacklisted;
      const nonBlacklistedBounties = repository.bounties.nodes.filter((bounty) => !bounty.blacklisted);
      const bountiesBlacklisted = nonBlacklistedBounties?.length === 0;
      return !organizationBlacklisted && !bountiesBlacklisted;
    };
    const repositoryIds = repositories
      .filter((repository) => checkBlacklisted(repository))
      .map((repository) => repository.id);
    const githubRepositories = await appState.githubRepository.fetchReposByIds([...repositoryIds]);
    return githubRepositories;
  } catch (err) {
    appState.logger.error(err);
    return [];
  }
};

export const getBountyTypeName = (type) => {
  const bountyType = type?.toString();
  switch (bountyType) {
    case '0':
      return 'Fixed Price';
    case '1':
      return 'Split Price';
    case '2':
      return 'Contest';
    case '3':
      return 'Hackathon';
    default:
      return 'Unknown';
  }
};
export const getTypeFromCategory = (category) => {
  switch (category) {
    case 'Fixed Price':
      return 0;
    case 'Split Price':
      return 1;
    case 'Hackathon':
      return 3;
    default:
      return null;
  }
};
export const needsOrgData = (accountData) => {
  const orgAccountKeys = ['company', 'city', 'streetAddress', 'province', 'country', 'invoicingEmail'];
  const neededAccountData = orgAccountKeys.filter((key) => {
    return !accountData[key];
  });
  return neededAccountData.length > 0;
};
export const needsFreelancerData = (accountData) => {
  const accountKeys = [
    'company',
    'billingName',
    'city',
    'streetAddress',
    'postalCode',
    'country',
    'phoneNumber',
    'province',
    'invoicingEmail',
    'invoiceNumber',
    'taxId',
    'vatNumber',
    'vatRate',
  ];
  const neededAccountData = accountKeys.filter((key) => {
    return !accountData[key] || accountData[key] == 0;
  });
  return neededAccountData.length > 0;
};
export const handleDispatch = (e, type, dispatchFunc) => {
  const dispatch = {
    type,
    payload: e.target.value,
  };
  dispatchFunc(dispatch);
};
export const updateHackathonState = async (hackathonState, appState, setCreateHackathonResponse, push) => {
  const {
    repositoryUrl,
    startDate,
    endDate,
    city,
    eventOrganizer,
    isIrl,
    timezone,
    topic,
    website,
    contactEmail,
    twitter,
    discord,
    telegram,
    description,
    slack,
    registrationDeadline,
    eventName,
    proAccountId,
    isDraft,
  } = hackathonState;
  const forwardedDraft = isDraft ? true : false;
  const ownerRegex = /github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)/;
  const owner = ownerRegex.exec(repositoryUrl)?.[1];
  const name = ownerRegex.exec(repositoryUrl)?.[2];
  try {
    setCreateHackathonResponse('PENDING');
    const githubRepository = await appState.githubRepository.fetchRepoByName(owner, name, []);
    const repositoryId = githubRepository.id;
    const organizationId = githubRepository.owner.id;
    const variables = {
      proAccountId,
      repositoryId,
      startDate,
      endDate,
      organizationId,
      isContest: true,
      isDraft: forwardedDraft,
      city,
      isIrl,
      timezone,
      eventOrganizer,
      repositoryUrl,
      topic,
      website,
      contactEmail,
      twitter,
      discord,
      telegram,
      slack,
      registrationDeadline,
      description,
      eventName,
    };
    await appState.openQPrismaClient.updateRepositoryAsContest(variables);
    setCreateHackathonResponse('SUCCESS');
    push();
  } catch (e) {
    setCreateHackathonResponse('ERROR');
  }
};
export const shortenString = (str, maxLen) => {
  if (str.length > maxLen) {
    return str.substring(0, maxLen) + '...';
  }
  return str;
};
