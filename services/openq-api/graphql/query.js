import { gql } from '@apollo/client';

export const GET_BOUNTY_BY_ADDRESS = gql`
  query bounty($contractAddress: String!) {
    bounty(address: $contractAddress) {
      tvl
      tvc
      requests(limit: 100) {
        nodes {
          id
          requestingUser {
            id
          }
        }
      }
      bountyId
      creatingUser {
        country
      }
    }
  }
`;

export const GET_SUBMISSION_BY_ID = gql`
  query getSubmission($id: String!) {
    submission(id: $id) {
      id
      bountyAddress
    }
  }
`;

// TODO: "Cannot query field \"prs\" on type \"Query\". Did you mean \"pr\"?"
export const GET_ALL_SUBMISSIONS = gql`
  query getALlSubmissions {
    submissions {
      id
      blacklisted
    }
  }
`;

export const GET_ALL_CONTRACTS = gql`
  query getAllContracts {
    bounties(limit: 100) {
      nodes {
        address
        bountyId
        blacklisted
        organization {
          blacklisted
        }
      }
    }
  }
`;

export const CREATE_PR = gql`
  mutation createPr($prId: String!, $bountyAddress: String!, $thumbnail: String) {
    createPr(prId: $prId, bountyAddress: $bountyAddress, thumbnail: $thumbnail) {
      prId
    }
  }
`;

export const ADD_CONTRIBUTOR = gql`
  mutation addContributor($prId: String, $userId: String, $address: String) {
    addContributor(prId: $prId, userId: $userId, address: $address) {
      thumbnail
    }
  }
`;

export const REMOVE_CONTRIBUTOR = gql`
  mutation remove($prId: String, $userId: String) {
    removeContributor(prId: $prId, userId: $userId) {
      thumbnail
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query ($id: String!) {
    user(id: $id) {
      github
      username
      discord
      twitter
      devRoles
      otherRoles
      interests
      languages
      frameworks
      starredOrganizationIds
    }
  }
`;

export const GET_USER = gql`
  query ($id: String, $email: String, $github: String, $username: String) {
    user(id: $id, email: $email, github: $github, username: $username) {
      id
      github
      username
      discord
      twitter
      devRoles
      otherRoles
      interests
      languages
      frameworks
      starredOrganizationIds
    }
  }
`;
export const GET_REQUESTS = gql`
  query ($id: String, $github: String, $email: String, $bountiesLimit: PaginationInt!, $bountiesCursor: ID) {
    user(id: $id, github: $github, email: $email) {
      id
      watchedBountyIds
      github
      email
      company
      username
      city
      streetAddress
      country
      province
      discord
      github
      twitter

      postalCode
      billingName
      invoiceNumber
      invoicingEmail
      phoneNumber
      taxId
      vatNumber
      vatRate
      memo

      createdBounties(limit: $bountiesLimit, after: $bountiesCursor) {
        bountyConnection {
          nodes {
            address
            bountyId
            type
            requests(limit: 100) {
              nodes {
                id
                requestingUser {
                  id
                  username
                  discord
                  github
                }
              }
            }
          }
          cursor
        }
      }
      starredOrganizationIds
    }
  }
`;

export const GET_PRO_ACCOUNT_INFO_CURRENT = gql`
  query ($types: [String], $category: String) {
    currentUser {
      id
      watchedBountyIds
      github
      email
      company
      username
      city
      streetAddress
      country
      province
      discord
      github
      twitter

      postalCode
      billingName
      invoiceNumber
      invoicingEmail
      phoneNumber
      taxId
      vatNumber
      vatRate
      memo
      adminOrganizations {
        nodes {
          name
          id
          adminUsers(limit: 10) {
            nodes {
              id
              username
            }
          }
          ownerUsers(limit: 10) {
            nodes {
              id
              username
            }
          }

          repositories(limit: 100) {
            nodes {
              id
            }
          }
        }
      }
      ownerOrganizations {
        nodes {
          name
          id
          adminUsers(limit: 10) {
            nodes {
              id
              username
            }
          }
          ownerUsers(limit: 10) {
            nodes {
              id
              username
            }
          }
        }
      }
      memberOrganizations {
        nodes {
          name
          id
        }
      }
      watchedBounties(limit: 100, types: $types, category: $category) {
        nodes {
          tvl
          tvc
          address
          bountyId
          watchingCount
        }
      }
      createdBounties(limit: 100) {
        nodes {
          address
          bountyId
          requests(limit: 100) {
            nodes {
              id
              requestingUser {
                id
                username
                discord
                github
              }
            }
          }
        }
      }
      starredOrganizationIds
    }
  }
`;

export const GET_PRIVATE_REQUEST = gql`
  query ($id: String!) {
    request(id: $id) {
      id
      message
    }
  }
`;

export const UPDATE_REQUEST = gql`
  mutation updateRequest($requestId: String!, $message: String!, $userId: String!) {
    updateRequest(requestId: $requestId, message: $message, userId: $userId) {
      id
      message
    }
  }
`;

export const GET_PRIVATE_USER = gql`
  query ($types: [String], $category: String) {
    currentUser {
      id
      watchedBountyIds
      github
      email
      company
      username
      city
      streetAddress
      country
      province
      discord
      github
      twitter

      postalCode
      billingName
      invoiceNumber
      invoicingEmail
      phoneNumber
      taxId
      vatNumber
      vatRate
      memo
      adminOrganizations {
        nodes {
          name
          id
          createdAt
          adminUsers(limit: 100) {
            nodes {
              id
              username
            }
          }
          ownerUsers(limit: 100) {
            nodes {
              id
              username
            }
          }
        }
      }
      ownerOrganizations {
        nodes {
          name
          id
        }
      }
      memberOrganizations {
        nodes {
          name
          id
        }
      }
      watchedBounties(limit: 100, types: $types, category: $category) {
        nodes {
          tvl
          tvc
          address
          bountyId
          watchingCount
        }
      }
      createdBounties(limit: 100) {
        nodes {
          address
          bountyId
          requests(limit: 100) {
            nodes {
              id
              requestingUser {
                id
                username
                discord
                github
              }
            }
          }
        }
      }
      starredOrganizationIds
    }
  }
`;

export const GET_USERS = gql`
  query getUsers {
    users {
      userConnection {
        nodes {
          watchedBountyIds
          github
          discord
          twitter
          email
          username
          starredOrganizationIds
          createdAt
        }
      }
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query getOrganization($organizationId: String!) {
    organization(organizationId: $organizationId) {
      blacklisted
      bounties(limit: 10) {
        bountyConnection {
          nodes {
            tvl
            tvc
            bountyId
            address
            blacklisted
            category
          }
          cursor
        }
      }
    }
  }
`;

export const GET_ORGANIZATIONS = gql`
  query getOrganizations($types: [String], $batch: PaginationInt!, $category: String) {
    organizations {
      nodes {
        blacklisted
        id
        starringUsers(limit: 100) {
          nodes {
            id
          }
        }
        bounties(limit: $batch, types: $types, category: $category) {
          nodes {
            tvl
            tvc
            bountyId
            address
            blacklisted
            category
          }
        }
      }
    }
  }
`;

export const GET_LEAN_ORGANIZATIONS = gql`
  query getLeanOrganizations {
    organizations {
      nodes {
        id
        blacklisted
      }
    }
  }
`;

export const GET_REPOSITORIES = gql`
  query getRepositories($organizationId: String, $contestOnly: Boolean) {
    repositories(limit: 100, contestOnly: $contestOnly, organizationId: $organizationId) {
      nodes {
        id
        hackathonBlacklisted
        description
        isContest
        isDraft
        startDate
        registrationDeadline
        city
        timezone
        eventOrganizer
        repositoryUrl
        isIrl
        endDate
        topic
        website
        contactEmail
        twitter
        discord
        telegram
        slack
        description
        organization {
          blacklisted
        }
        bounties(limit: 100) {
          nodes {
            bountyId
            blacklisted
          }
        }
      }
    }
  }
`;
export const GET_REPOSITORY_BY_ID = gql`
  query getRepositoryById($id: String!) {
    repository(id: $id) {
      id
      hackathonBlacklisted
      description
      isContest
      isDraft
      startDate
      registrationDeadline
      city
      timezone
      eventOrganizer
      eventName
      repositoryUrl
      isIrl
      endDate
      topic
      website
      contactEmail
      twitter
      createdAsHackathonDate
      discord
      proAccountId
      telegram
      slack
      description
      organization {
        blacklisted
      }
      bounties(limit: 100) {
        nodes {
          bountyId
          blacklisted
        }
      }
    }
  }
`;
export const UPSERT_USER = gql`
  mutation upsertUser {
    upsertUser {
      github
      email
      username
      id
    }
  }
`;

export const COMBINE_USERS = gql`
  mutation combineUsers($id: String, $email: String, $github: String) {
    combineUsers(id: $id, email: $email, github: $github) {
      github
      email
      company
      username
      city
      streetAddress
      country
      province
      discord
      github
      twitter
      postalCode
      invoicingEmail
      billingName
      invoiceNumber
      invoicingEmail
      phoneNumber
      taxId
      vatNumber
      vatRate
      memo
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $username: String
    $company: String
    $city: String
    $streetAddress: String
    $country: String
    $province: String
    $discord: String
    $twitter: String
    $devRoles: [String]
    $frameworks: [String]
    $languages: [String]
    $otherRoles: [String]
    $interests: [String]
    $postalCode: String
    $billingName: String
    $invoiceNumber: Int
    $invoicingEmail: String
    $phoneNumber: String
    $taxId: String
    $vatNumber: String
    $vatRate: Float
    $memo: String
  ) {
    updateUser(
      username: $username
      company: $company
      city: $city
      streetAddress: $streetAddress
      country: $country
      province: $province
      discord: $discord
      twitter: $twitter
      devRoles: $devRoles
      frameworks: $frameworks
      languages: $languages
      otherRoles: $otherRoles
      interests: $interests
      postalCode: $postalCode
      invoiceNumber: $invoiceNumber
      invoicingEmail: $invoicingEmail
      billingName: $billingName
      phoneNumber: $phoneNumber
      taxId: $taxId
      vatNumber: $vatNumber
      vatRate: $vatRate

      memo: $memo
    ) {
      github
      email
      company
      username
      city
      streetAddress
      country
      otherRoles
      interests
      languages
      frameworks
      devRoles
      province
      discord
      github
      twitter
      postalCode
      invoicingEmail
      billingName
      invoiceNumber
      invoicingEmail
      phoneNumber
      taxId
      vatNumber
      vatRate
      memo
    }
  }
`;

export const WATCH_BOUNTY = gql`
  mutation WatchBounty($contractAddress: String!, $userId: String!, $github: String, $email: String) {
    watchBounty(contractAddress: $contractAddress, userId: $userId, github: $github, email: $email) {
      watchingCount
    }
  }
`;

export const UNWATCH_BOUNTY = gql`
  mutation UnwatchBounty($contractAddress: String!, $userId: String!, $github: String, $email: String) {
    unwatchBounty(contractAddress: $contractAddress, userId: $userId, github: $github, email: $email) {
      address
      watchingCount
    }
  }
`;

export const STAR_ORGANIZATION = gql`
  mutation StarOrg($userId: String!, $organizationId: String!, $github: String, $email: String) {
    starOrg(userId: $userId, organizationId: $organizationId, github: $github, email: $email) {
      id
      starringUsers(limit: 100) {
        nodes {
          id
        }
      }
    }
  }
`;

export const UNSTAR_ORGANIZATION = gql`
  mutation unstarOrg($userId: String!, $organizationId: String!, $github: String, $email: String) {
    unstarOrg(userId: $userId, organizationId: $organizationId, github: $github, email: $email) {
      id
      starringUsers(limit: 100) {
        nodes {
          id
        }
      }
    }
  }
`;

export const GET_CONTRACT_PAGE = gql`
  query BountiesConnection(
    $after: ID
    $orderBy: String
    $sortOrder: String
    $organizationId: String
    $types: [String]
    $limit: PaginationInt!
    $category: String
    $repositoryId: String
  ) {
    bounties(
      after: $after
      limit: $limit
      orderBy: $orderBy
      sortOrder: $sortOrder
      organizationId: $organizationId
      types: $types
      category: $category
      repositoryId: $repositoryId
    ) {
      bountyConnection {
        nodes {
          tvl
          tvc
          address
          organizationId
          repositoryId
          bountyId
          type
          category
          watchingCount
          createdAt
          blacklisted
          organization {
            blacklisted
          }
        }
        cursor
      }
    }
  }
`;

export const BLACKLIST_ISSUE = gql`
  mutation blacklist($bountyId: String, $blacklist: Boolean) {
    blacklist(bountyId: $bountyId, blacklist: $blacklist) {
      blacklisted
    }
  }
`;

export const BLACKLIST_ORGANIZATION = gql`
  mutation blacklistOrg($organizationId: String, $blacklist: Boolean) {
    blacklistOrg(organizationId: $organizationId, blacklist: $blacklist) {
      blacklisted
    }
  }
`;

export const UPDATE_REPOSITORY_AS_CONTEST = gql`
  mutation updateRepositoryAsContest(
    $repositoryId: String!
    $organizationId: String
    $isContest: Boolean!
    $isDraft: Boolean!
    $proAccountId: String!
    $startDate: String
    $registrationDeadline: String
    $city: String
    $timezone: String
    $eventOrganizer: String
    $eventName: String
    $repositoryUrl: String
    $isIrl: Boolean
    $endDate: String
    $topic: [String]
    $website: String
    $contactEmail: String
    $twitter: String
    $discord: String
    $telegram: String
    $slack: String
    $description: String
  ) {
    updateRepositoryAsContest(
      repositoryId: $repositoryId
      organizationId: $organizationId
      isContest: $isContest
      isDraft: $isDraft
      proAccountId: $proAccountId
      description: $description
      startDate: $startDate
      registrationDeadline: $registrationDeadline
      city: $city
      timezone: $timezone
      eventOrganizer: $eventOrganizer
      eventName: $eventName
      repositoryUrl: $repositoryUrl
      isIrl: $isIrl
      endDate: $endDate
      topic: $topic
      website: $website
      contactEmail: $contactEmail
      twitter: $twitter
      discord: $discord
      telegram: $telegram
      slack: $slack
    ) {
      isContest
      id
    }
  }
`;

export const CREATE_PRO_ACCOUNT = gql`
  mutation CreateProAccount($name: String!) {
    createProAccount(name: $name) {
      id
      name
    }
  }
`;

export const GET_PRO_ACCOUNTS = gql`
  query GetProAccount {
    proAccounts {
      proAccountConnection {
        nodes {
          name
          id

          adminUsers(limit: 10) {
            nodes {
              id
              github
            }
          }
          ownerUsers(limit: 10) {
            nodes {
              id
              github
            }
          }
          memberUsers(limit: 10) {
            nodes {
              id
              github
            }
          }
          permissionedProducts(limit: 10) {
            nodes {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_PRO_ACCOUNT = gql`
  query GetProAccount($id: String!) {
    proAccount(id: $id) {
      id
      name
      adminUsers(limit: 10) {
        nodes {
          id
          username
          github
        }
      }
      ownerUsers(limit: 10) {
        nodes {
          id
          username
          github
        }
      }
      memberUsers(limit: 10) {
        nodes {
          id
          username
          github
        }
      }
      permissionedProducts(limit: 10) {
        nodes {
          id
          name
        }
      }
    }
  }
`;
export const GET_PRODUCTS = gql`
  query GetProducts {
    products(limit: 10) {
      productConnection {
        nodes {
          id
          name
        }
      }
    }
  }
`;
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!) {
    createProduct(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $name: String!) {
    updateProduct(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const ADD_PRODUCT_TO_PRO_ACCOUNT = gql`
  mutation AddProductToProAccount($proAccountId: String!, $productId: String!) {
    addProductToProAccount(proAccountId: $proAccountId, productId: $productId) {
      id
      name
    }
  }
`;

export const ADD_PRO_ACCOUNT_ADMIN = gql`
  mutation AddProAccountAdmin($proAccountId: String!, $targetUserId: String!) {
    addProAccountAdmin(proAccountId: $proAccountId, targetUserId: $targetUserId) {
      id
      name
    }
  }
`;

export const ADD_PRO_ACCOUNT_MEMBER = gql`
  mutation AddProAccountMember($proAccountId: String!, $targetUserId: String!) {
    addProAccountMember(proAccountId: $proAccountId, targetUserId: $targetUserId) {
      id
      name
    }
  }
`;

export const REMOVE_PRO_ACCOUNT_ADMIN = gql`
  mutation RemoveProAccountAdmin($proAccountId: String!, $targetUserId: String!) {
    removeProAccountAdmin(proAccountId: $proAccountId, targetUserId: $targetUserId) {
      id
      name
    }
  }
`;

export const REMOVE_PRO_ACCOUNT_MEMBER = gql`
  mutation RemoveProAccountMember($proAccountId: String!, $targetUserId: String!) {
    removeProAccountMember(proAccountId: $proAccountId, targetUserId: $targetUserId) {
      id
      name
    }
  }
`;

export const GET_USERS_PAGE = gql`
  query GetUsersPage($after: ID, $limit: PaginationInt) {
    users(limit: $limit, after: $after) {
      userConnection {
        nodes {
          id
          github
          username
          ownerOrganizations {
            nodes {
              id
            }
          }
          adminOrganizations {
            nodes {
              id
            }
          }
          memberOrganizations {
            nodes {
              id
            }
          }
        }
        cursor
      }
    }
  }
`;
