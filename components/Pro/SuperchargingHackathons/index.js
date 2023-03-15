import React from 'react';
import Link from 'next/link';

const SuperchargingHackathons = ({ proAccount }) => {
  return (
    <div>
      <Link href={`/pro/${proAccount.id}/hackathons/create`}>Create a New Hackathon</Link>
    </div>
  );
};

export default SuperchargingHackathons;
