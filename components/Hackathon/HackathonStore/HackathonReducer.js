const HackathonReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENT_ORGANIZER':
      return { ...state, eventOrganizer: action.payload };
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_REPOSITORY_URL':
      return { ...state, repositoryUrl: action.payload };
    case 'SET_IS_IRL':
      return { ...state, isIrl: action.payload };
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_TIMEZONE':
      return { ...state, timezone: action.payload };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_END_DATE':
      return { ...state, endDate: action.payload };
    case 'SET_TOPIC':
      return { ...state, topic: action.payload };
    case 'SET_WEBSITE':
      return { ...state, website: action.payload };
    case 'SET_CONTACT_EMAIL':
      return { ...state, contactEmail: action.payload };
    case 'SET_TWITTER':
      return { ...state, twitter: action.payload };
    case 'SET_DISCORD':
      return { ...state, discord: action.payload };
    case 'SET_TELEGRAM':
      return { ...state, telegram: action.payload };
    case 'SET_SLACK':
      return { ...state, slack: action.payload };
    default:
      return state;
  }
};

export default HackathonReducer;
