let InitialState = {};

switch (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
  case 'local':
    InitialState = {
      isAuthenticated: true,
    };
    break;

  default:
    InitialState = {
      isAuthenticated: null,
      _id: null,
    };
}

export default InitialState;
