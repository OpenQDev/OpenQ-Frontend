const ProAccountReducer = (state, action) => {
  console.log(action, 'action');
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
