import React from 'react';
const HackathonCard = ({ repository, githubRepository }) => {
  console.log(githubRepository, 'my github repository');
  return (
    <div className='border-web-gray border rounded-md px-4'>
      <h3>{githubRepository?.name}</h3>
    </div>
  );
};

export default HackathonCard;
