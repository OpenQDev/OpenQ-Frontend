import { ethers } from 'ethers';
import InitialFundState from './InitialFundState';

const FundReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INVOICEABLE': {
      return {
        ...state,
        invoiceable: action.payload,
      };
    }
    case 'SET_TOKEN': {
      return {
        ...state,
        token: { ...action.payload, address: ethers.utils.getAddress(action.payload.address) },
      };
    }
    case 'SET_VOLUME': {
      return {
        ...state,
        volume: action.payload,
      };
    }
    case 'SET_NFT_TIER': {
      return {
        ...state,
        nftTier: action.payload,
      };
    }
    case 'SET_ALLOWANCE': {
      return {
        ...state,
        allowance: action.payload,
      };
    }
    case 'SET_DEPOSIT_PERIOD_DAYS': {
      return {
        ...state,
        depositPeriodDays: action.payload,
      };
    }
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
        approveTransferState: 'ERROR',
      };
    }
    case 'SET_APPROVING': {
      return {
        ...state,
        approveTransferState: 'APPROVING',
        approveTransferModal: true,
      };
    }
    case 'SET_TRANSACTION_HASH': {
      return {
        ...state,
        transactionHash: action.payload,
      };
    }
    case 'SET_NFT': {
      return {
        ...state,
        pickedNft: action.payload,
      };
    }
    case 'SET_APPROVE_TRANSFER_STATE': {
      return {
        ...state,
        approveTransferState: action.payload,
      };
    }
    case 'RESET_STATE': {
      return InitialFundState;
    }
    default:
      return state;
  }
};

export default FundReducer;
