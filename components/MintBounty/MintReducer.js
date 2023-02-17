const MintReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_GOAL_TOKEN': {
      return {
        ...state,
        goalToken: action.payload,
      };
    }
    case 'UPDATE_GOAL_VOLUME': {
      return {
        ...state,
        goalVolume: action.payload,
      };
    }
    case 'UPDATE_PAYOUT_TOKEN': {
      return {
        ...state,
        payoutToken: action.payload,
      };
    }
    case 'UPDATE_PAYOUT_VOLUME': {
      return {
        ...state,
        payoutVolume: action.payload,
      };
    }
    case 'UPDATE_START_DATE': {
      return {
        ...state,
        startDate: action.payload,
      };
    }
    case 'UPDATE_REGISTRATION_DEADLINE': {
      return {
        ...state,
        registrationDeadline: action.payload,
      };
    }
    case 'UPDATE_ENABLE_REGISTRATION': {
      return {
        ...state,
        enableRegistration: action.payload,
      };
    }
    case 'SET_TYPE': {
      return {
        ...state,
        type: action.payload,
      };
    }
    case 'UPDATE_FINAL_TIER_VOLUMES': {
      return {
        ...state,
        finalTierVolumes: action.payload,
      };
    }
    case 'UPDATE_IS_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case 'UPDATE_SUM': {
      return {
        ...state,
        sum: action.payload,
      };
    }
    case 'UPDATE_HIDE_MODAL': {
      return {
        ...state,
        hideModal: action.payload,
      };
    }
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case 'SET_ISSUE': {
      return {
        ...state,
        issue: action.payload,
      };
    }

    case 'SET_ENABLE_MINT': {
      return {
        ...state,
        enableMint: action.payload,
      };
    }
    case 'SET_INVOICEABLE': {
      return {
        ...state,
        invoiceable: action.payload,
      };
    }
    case 'SET_KYC_REQUIRED': {
      return {
        ...state,
        kycRequired: action.payload,
      };
    }
    case 'SET_SUPPORTING_DOCUMENTS_REQUIRED': {
      return {
        ...state,
        supportingDocumentsRequired: action.payload,
      };
    }
    case 'SET_ALT_URL': {
      return {
        ...state,
        altUrl: action.payload.avatarUrl,
        altName: action.payload.name,
      };
    }

    case 'SET_W8_REQUIRED': {
      return {
        ...state,
        w8Required: action.payload,
      };
    }

    default:
      return state;
  }
};

export default MintReducer;
