class Utils {
  constructor() {}

  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  formatUnixDate = (unixTime, hideDate) => {
    var date = new Date(unixTime * 1000);

    var day = date.getDate();
    var month = this.monthNames[date.getMonth()];
    var year = date.getFullYear();

    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = date.getMinutes();
    const displayMinutes = `${minutes.toString().length === 1 ? '0' : ''}${minutes}`;
    // Seconds part from the timestamp
    //var seconds = '0' + date.getSeconds();

    // Will display time in 10:30:23 format
    if (hideDate) {
      return `${month} ${day}, ${year}`;
    }
    var formattedTime = `${month} ${day}, ${year} at ${hours}:${displayMinutes}`;
    return formattedTime;
  };

  formatDate = (createdAt, hideDate) => {
    return this.formatUnixDate(new Date(createdAt), hideDate);
  };

  formatUnixDateWithTime = (unixTime, hideDate) => {
    var date = new Date(unixTime * 1000);

    var day = date.getDate();
    var month = this.monthNames[date.getMonth()];
    var year = date.getFullYear();

    // // Hours part from the timestamp
    // var hours = date.getHours();
    // // Minutes part from the timestamp
    // var minutes = '0' + date.getMinutes();
    // // Seconds part from the timestamp
    // var seconds = '0' + date.getSeconds();

    // Will display time in 10:30:23 format
    if (hideDate) {
      return `${month} ${day}, ${year}`;
    }
    var formattedTime = `${month} ${day}, ${year}`;
    return formattedTime;
  };

  issurUrlRegex = (issueUrl) => {
    const pattern = /https?:\/\/github\.com\/(?:[^\/\s]+\/)+(?:issues\/\d+)/;
    return pattern.test(issueUrl);
  };

  userUrlRegex = (userUrl) => {
    const pattern = /https?:\/\/github\.com\/[\w-\d]+/;
    return pattern.test(userUrl);
  };

  updateVolume(volume, updater) {
    const numberRegex = /^(\d+)?(\.)?(\d+)?$/;
    if (numberRegex.test(volume) || volume === '' || volume === '.') {
      updater(volume.match(numberRegex)[0]);
    }
  }
  // Thanks rmwxiong https://gist.github.com/rmwxiong/ad6e922dcc739a599640/02854508d14e737e38293c5467d75c45843830c8
  avgcolor(color1, color2) {
    var avg = function (a, b) {
        return (a + b) / 2;
      },
      t16 = function (c) {
        return parseInt('' + c, 16);
      },
      hex = function (c) {
        var t = (c >> 0).toString(16);
        return t.length == 2 ? t : '0' + t;
      },
      hex1 = t16(color1),
      hex2 = t16(color2),
      r = function (hex) {
        return (hex >> 16) & 0xff;
      },
      g = function (hex) {
        return (hex >> 8) & 0xff;
      },
      b = function (hex) {
        return hex & 0xff;
      },
      res = hex(avg(r(hex1), r(hex2))) + hex(avg(g(hex1), g(hex2))) + hex(avg(b(hex1), b(hex2)));
    return res;
  }

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  handleSuffix(t) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = t % 100;
    return t + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  combineBounties = (subgraphBounties, githubIssues, metadata) => {
    const fullBounties = [];
    metadata.forEach((contract) => {
      const relatedIssue = githubIssues.find((issue) => issue?.id == contract.bountyId);
      const subgraphBounty = subgraphBounties.find((bounty) => {
        return contract.address?.toLowerCase() === bounty.bountyAddress;
      });

      if (relatedIssue && contract && !contract.blacklisted) {
        let mergedBounty = { ...relatedIssue, ...subgraphBounty, ...contract };
        fullBounties.push(mergedBounty);
      }
    });
    return fullBounties;
  };

  getBountyMarker = (bounty, login) => {
    if (bounty.closed) return { status: 'Closed', colour: 'bg-danger', fill: 'fill-danger' };
    if (bounty.bountyType === '0') {
      if (bounty.status == '1') {
        if (bounty.claims?.length && bounty?.prs?.some((pr) => pr.source.author?.login === login)) {
          return {
            status: 'Claimed',
            colour: 'bg-danger',
            fill: 'fill-danger',
          };
        }
      }
      if (bounty.status == '0' && bounty?.prs?.some((pr) => pr.source.merged)) {
        {
          if (bounty?.prs?.some((pr) => pr.source.author?.login === login)) {
            return {
              status: 'Claim Available',
              colour: 'bg-closed',
              fill: 'fill-closed',
            };
          }
        }
      }
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
      return { status: 'Open', colour: 'bg-green', fill: 'fill-green' };
    }
  };

  getBountyTypeName = (bounty) => {
    switch (bounty.bountyType) {
      case '0':
        return 'Fixed Price';
      case '1':
        return 'Split Price';

      case '2':
        return 'Contest';

      case '3':
        return 'Contest';
    }
  };

  fetchOrganizations = async ({ githubRepository, openQPrismaClient }, types, category) => {
    const promise = new Promise(async (resolve, reject) => {
      let githubOrganizations = [];
      const batch = 100;
      let orgData = [];
      try {
        orgData = await openQPrismaClient.getOrganizations(types, batch, category);
      } catch (err) {
        reject(err);
      }
      const filteredOrgs = orgData.organizations.filter((data) => !data.blacklisted);
      const orgIds = filteredOrgs.map((org) => org.id);
      try {
        githubOrganizations = await githubRepository.fetchOrganizationsByIds(orgIds);
      } catch (err) {
        reject(err);
      }

      const mergedOrgs =
        filteredOrgs
          .map((org) => {
            let currentGithubOrg;
            for (const githubOrganization of githubOrganizations) {
              if (org.id === githubOrganization.id) {
                currentGithubOrg = githubOrganization;
              }
            }
            return { ...org, ...currentGithubOrg };
          })
          .filter((org) => {
            return !org.blacklisted;
          }) || [];
      resolve(mergedOrgs);
    });
    return promise;
  };

  fetchBounties = async (
    { openQSubgraphClient, githubRepository, openQPrismaClient, logger },
    batch,
    types,
    sortOrder,
    orderBy,
    cursor,
    organization,
    address,
    category
  ) => {
    const promise = new Promise(async (resolve, reject) => {
      let newCursor;
      let prismaContracts;
      try {
        const prismaContractsResult = await openQPrismaClient.getContractPage(
          cursor,
          batch,
          sortOrder,
          orderBy,
          types,
          organization,
          category
        );
        prismaContracts =
          prismaContractsResult.nodes.filter(
            (contract) => !contract.blacklisted && !contract.organization.blacklisted
          ) || [];
        newCursor = prismaContractsResult.cursor;

        const bountyAddresses = prismaContracts.map((bounty) => bounty.address.toLowerCase());
        const bountyIds = prismaContracts.map((contract) => contract.bountyId);

        let subgraphContracts = [];
        try {
          subgraphContracts = await openQSubgraphClient.getBountiesByContractAddresses(bountyAddresses);
        } catch (err) {
          reject(err);
        }
        let githubIssues = [];
        try {
          githubIssues = await githubRepository.getIssueData(bountyIds);
        } catch (err) {
          reject(err);
        }
        const fullBounties = this.combineBounties(subgraphContracts, githubIssues, prismaContracts);

        resolve([fullBounties, newCursor]);
      } catch (err) {
        reject(err);
        logger.error({ ...err, address });
      }
    });
    return promise;
  };

  fetchWatchedBounties = async (
    { openQSubgraphClient, githubRepository, openQPrismaClient, logger },
    account,
    types,
    category
  ) => {
    let subgraphContracts = [];
    let githubIssues = [];
    let prismaContracts = [];
    try {
      const prismaResult = await openQPrismaClient.getUser(account, types, category);
      prismaContracts = prismaResult?.watchedBounties.nodes || [];
      const watchedBountyAddresses = prismaResult?.watchedBountyIds.map((address) => address.toLowerCase()) || [];
      const watchedBountyIds = prismaContracts?.map((contract) => contract.bountyId);
      subgraphContracts = await openQSubgraphClient.getBountiesByContractAddresses(watchedBountyAddresses);
      githubIssues = await githubRepository.getIssueData(watchedBountyIds);
    } catch (err) {
      logger.error({ ...err, address: account });
    }
    const watchedBounties = this.combineBounties(subgraphContracts, githubIssues, prismaContracts);

    return [watchedBounties];
  };

  mergeOrdered = (inputArr) => {
    // tracks what index need to be refered to in each object in the input arr
    const progressTracker = {};
    inputArr.forEach((_, index) => {
      progressTracker[index] = 0;
    });

    // holds results
    const returnArr = [];

    // tracks index algorthim is on in the return arr
    let returnArrIndex = 0;

    const expectedLength = inputArr.map((input) => input.arr).flat().length;
    while (returnArrIndex < expectedLength) {
      // holds highest value which hasn't been added to return arr
      let highest = { sortValue: 0 };

      // iterates through input arr and sets current highest to correct values;
      inputArr.forEach((currentObject, i) => {
        // where are we in the arr that this object holds.
        const currentObjectProgress = progressTracker[i];
        let currentObjectArr = currentObject.arr;

        // only continue if the tracked index has a value
        if (currentObjectProgress < currentObjectArr.length) {
          // the prop we are sorting based on
          let currentPropValue = currentObject.prop;
          const sortValue = currentObjectArr[currentObjectProgress][currentPropValue];
          if (sortValue > highest.sortValue) {
            highest.sortValue = sortValue;
            highest.index = i;
            highest.obj = currentObjectArr[currentObjectProgress];
          }
        }
      });
      if (highest.sortValue) {
        returnArr[returnArrIndex] = highest;
        progressTracker[highest.index]++;
      }
      returnArrIndex++;
    }
    return returnArr.map((elem) => elem.obj);
  };

  capitalize = (word) => {
    return word[0].toUpperCase() + word.substring(1);
  };

  // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
  pageview = (url) => {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_path: url,
    });
  };

  toIng = (word, bool) => {
    if (bool) return word.slice(0, length - 1) + 'ing';
    return word;
  };
}

export default Utils;
