import React from 'react';
import Link from 'next/link';

const SuperchargingHackathons = ({ teamAccount }) => {
  return (
    <div>
      <Link href={`/pro/${teamAccount.id}/hackathons/create`}>Create a New Hackathon</Link>
    </div>
  );
};

export default SuperchargingHackathons;
