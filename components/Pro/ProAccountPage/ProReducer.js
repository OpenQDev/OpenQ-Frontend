const ProAccountReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_OWNER_ORGANIZATION':
      return {
        ...state,
        ownerOrganizations: [...state.ownerOrganizations, action.payload],
      };
    default:
      return state;
  }
};

export default ProAccountReducer;
