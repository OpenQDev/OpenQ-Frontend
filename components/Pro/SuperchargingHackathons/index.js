import React from 'react';
import CreateHackathonPage from '../CreateHackathonPage/index.js';

const SuperchargingHackathons = ({ proAccount }) => {
  const [createPage, setCreatePage] = React.useState(false);
  const makeRepoHackathon = async () => {
    setCreatePage(true);
  };
  return (
    <div>
      {!createPage ? (
        <button onClick={makeRepoHackathon}>Create a New Hackathon</button>
      ) : (
        <CreateHackathonPage proAccount={proAccount} />
      )}
    </div>
  );
};

export default SuperchargingHackathons;
