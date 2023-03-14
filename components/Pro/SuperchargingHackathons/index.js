import React from 'react';
import CreateHackathonPage from '../CreateHackathonPage/index.js';

const SuperchargingHackathons = () => {
  const [createPage, setCreatePage] = React.useState(false);
  const makeRepoHackathon = async () => {
    setCreatePage(true);
  };
  return (
    <div>
      {!createPage ? <button onClick={makeRepoHackathon}>Create a New Hackathon</button> : <CreateHackathonPage />}
    </div>
  );
};

export default SuperchargingHackathons;
