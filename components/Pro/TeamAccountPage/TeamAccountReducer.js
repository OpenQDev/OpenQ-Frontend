const TeamAccountReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case 'ADD_OWNER_ORGANIZATION':
      return {
        ...state,
        ownerOrganizations: [...state.ownerOrganizations, action.payload],
      };
    case 'ADD_ADMIN': {
      console.log('please update', state, action);
      return { ...state, adminUsers: action.payload.adminUsers };
    }
    default:
      return state;
  }
};

export default TeamAccountReducer;
