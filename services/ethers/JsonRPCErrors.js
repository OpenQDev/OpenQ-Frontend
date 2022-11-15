import Utils from '../utils/Utils';

/**
 * Each method contains a tuple of { CONTRACT_THROWN_REVERT_STRING : USER_FRIENDLY ERROR MESSAGE }
 */
const jsonRpcErrors = [
  // MINT
  {
    'ERC1167: create2 failed': {
      title: 'Contract already exists',
      message: () => {
        return 'A contract for that issue already exists. Make sure to add an issue that has not been deployed as a contract yet. If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },
  // FUND
  {
    FUNDING_CLOSED_BOUNTY: {
      title: 'Cannot fund a closed contract',
      message: ({ bounty }) => {
        return `This contract was closed on ${bounty.bountyClosedTime}. You cannot fund a closed contract. If you need more information or want to report a bug, please contact info@openq.dev`;
      },
    },
  },
  {
    ZERO_VOLUME_SENT: {
      title: 'Zero Volume Sent',
      message: () => {
        return 'The token volume needs to be strictly more than 0. Are you sure you have entered an amount of tokens for this transaction? If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },
  {
    TOO_MANY_TOKEN_ADDRESSES: {
      title: 'Too Many Token Addresses',
      message: () => {
        return 'This contract already has the maximum number of token funded addresses. You can still fund with USDC. If you would like to get whitelisted, please contact info@openq.dev';
      },
    },
  },
  {
    'ERC20: transfer amount exceeds balance': {
      title: 'Transfer amount exceeds balance',
      message: () => {
        return 'It seems like you are trying to transfer a token volume that exceeds your address balance. Did you enter the correct amount of tokens for this transfer? If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },
  {
    NONCE_TO_HIGH: {
      title: 'Nonce Too High',
      message: () => {
        return 'Nonce too high. If developing locally, Go to MetaMask -> Accounts -> Settings -> Advanced -> Reset Account. If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },
  // REFUND
  {
    BOUNTY_ALREADY_REFUNDED: {
      title: 'Contract Already Refunded',
      message: () => {
        return 'This contract was already refunded. If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },
  {
    PREMATURE_REFUND_REQUEST: {
      title: 'Too early to withdraw funds',
      message: ({ bounty }) => {
        const utils = new Utils();
        return `Contract was minted on ${utils.formatUnixDate(
          bounty.bountyMintTime
        )} and the funds on this deposit are still locked. Please check the date at which it becomes refundable again before requesting a refund. If you need more information or want to report a bug, please contact info@openq.dev`;
      },
    },
  },
  {
    ONLY_FUNDERS_CAN_REQUEST_REFUND: {
      title: 'Not a Funder',
      message: ({ account }) =>
        `Only funders can request refunds on this issue. Your address ${account} has not funded this issue. Make sure you connect the right wallet or are on the right issue. If you need more information or want to report a bug, please contact info@openq.dev`,
    },
  },
  {
    REFUNDING_CLOSED_BOUNTY: {
      title: 'Cannot request refund on a closed contract',
      message: () =>
        'You are requesting a refund on a closed contract. If you need more information or want to report a bug, please contact info@openq.dev',
    },
  },
  // CLAIM
  {
    COMPETITION_ALREADY_CLOSED: {
      title: 'This contest is already closed, you cannot close it again',
      message: () =>
        'You are attempting to close a closed contest. If you need more information or want to report a bug, please contact info@openq.dev',
    },
  },
  {
    ONGOING_BOUNTY_ALREADY_CLOSED: {
      title: 'This repeating contract is already closed, you cannot close it again',
      message: () =>
        'You are attempting to close a closed repeating contract. This action has already been performed. If you need more information or want to report a bug, please contact info@openq.dev',
    },
  },
  {
    CLAIMING_CLOSED_BOUNTY: {
      title: 'Cannot claim a closed contract',
      message: () =>
        'You are attempting to claim a closed contract. If you need more information or want to report a bug, please contact info@openq.dev',
    },
  },
  // CONNECTION
  {
    METAMASK_HAVING_TROUBLE: {
      title: 'Cannot Connect to network.',
      message: () => {
        return 'Please check your wallet settings and make sure you are connected to the right network. If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },
  // MISCELLANEOUS
  {
    USER_DENIED_TRANSACTION: {
      title: 'User Denied Transaction',
      message: () => {
        return 'You have been denied the transaction. If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },

  {
    INTERNAL_ERROR: {
      title: 'Internal RPC Error',
      message: () => {
        return 'Something went awry and the transaction failed! Please reload and try again. If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },

  {
    UNDERPRICED_TXN: {
      title: 'Underpriced Transaction!',
      message: () => {
        return 'Set a higher gas fee to get your transaction through. See how ';
      },
      link: 'https://metamask.zendesk.com/hc/en-us/articles/360022895972',
      linkText: 'here.',
    },
  },

  {
    OUT_OF_GAS: {
      title: 'Out of Gas',
      message: () => {
        return 'The transaction ran out of gas. You might need to set a higher gas fee to get your transaction through. If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },

  {
    CFA_EXISTS: {
      title: 'Stream Already Created',
      message: (recipient) => {
        return `Stream already created from your address to ${recipient.slice(0, 4)}...${recipient.slice(
          38
        )}. If you\'d like to change the terms of your stream, please use the update button. If you need more information or want to report a bug, please contact info@openq.dev`;
      },
    },
  },
  {
    CFA_DOES_NOT_EXIST: {
      title: 'Stream does not exist',
      message: (recipient) => {
        return `No stream exists from your address to ${recipient.slice(0, 4)}...${recipient.slice(
          38
        )}. If you need more information or want to report a bug, please contact info@openq.dev`;
      },
    },
  },

  {
    CALL_EXCEPTION: {
      title: 'Polygon Call Exception',
      message: () => {
        return 'An exception occured while calling Polygon. You might want to try again. If you need more information or want to report a bug, please contact info@openq.dev';
      },
    },
  },
];

export default jsonRpcErrors;
