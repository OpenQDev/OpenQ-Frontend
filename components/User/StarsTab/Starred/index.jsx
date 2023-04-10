// Third Party
import React from 'react';
import ProfileTabWrapper from '../../ProfileTabWrapper';

// Custom
import OrganizationCard from '../../../Organization/OrganizationCard';

const Starred = ({ starredOrganizations }) => {
  return (
    <ProfileTabWrapper title='Starred' message='Organizations you are keeping track of.'>
      {starredOrganizations.length > 0 && (
        <div className='py-6 border-border-gray flex gap-4 flex-wrap justify-center sm:justify-start items-stretch w-full font-semibold text-lg'>
          {starredOrganizations.map((organization, index) => (
            <OrganizationCard starringParent='true' key={index} organization={organization} />
          ))}
        </div>
      )}
    </ProfileTabWrapper>
  );
};

export default Starred;
