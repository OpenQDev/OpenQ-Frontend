import React from 'react';
import HackathonCard from '../Hackathon/HackathonCard';
const Manager = ({ repositories }) => {
  return (
    <>
      {repositories?.map((repository, index) => {
        return <HackathonCard repository={repository} key={index} />;
      })}
    </>
  );
};

export default Manager;
