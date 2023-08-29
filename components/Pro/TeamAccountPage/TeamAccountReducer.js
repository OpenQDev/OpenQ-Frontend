const TeamAccountReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_OWNER_ORGANIZATION':
      return {
        ...state,
        ownerOrganizations: [...state.ownerOrganizations, action.payload],
      };
    case 'ADD_ADMIN': {
      return { ...state, adminUsers: action.payload.adminUsers };
    }
    default:
      return state;
  }
};

export default TeamAccountReducer;
