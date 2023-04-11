import React from 'react';
import Roles from '../Roles';

const Skills = ({ user }) => {
  return (
    <div className='px-8 py-6 pb border-t border-web-gray'>
      <h2 className='font-semibold text-lg pb-2 '>Skills</h2>
      <ul>
        <Roles user={user} category='Dev Role' defaultRoles={user.devRoles} />
        <Roles user={user} category='Other Role' defaultRoles={user.otherRoles} />
        <Roles user={user} category='Language' defaultRoles={user.languages} />
        <Roles user={user} category='Framework' defaultRoles={user.frameworks} />
      </ul>
    </div>
  );
};

export default Skills;
