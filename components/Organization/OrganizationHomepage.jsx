// Third party
import React, { useState } from 'react';

// Custom
import OrganizationCard from '../Organization/OrganizationCard';
import MintBountyButton from '../MintBounty/MintBountyButton';
import SearchBar from '../Search/SearchBar';
import Carousel from '../Utils/Carousel';
import HorizontalOrganizationCard from './HorizontalOrganizationCard';
const OrganizationHomepage = ({ orgs, types }) => {
  const organizationIds = orgs.map((org) => org.id);
  // State
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');
  const filterByOrg = (e) => {
    setOrganizationSearchTerm(e.target.value);
  };
  const checkSearchTerm = (organization, organizationSearchTerm) => {
    return organizationSearchTerm
      ? organization.name?.toLowerCase().indexOf(organizationSearchTerm.toLowerCase()) > -1 ||
          organization.login?.toLowerCase().indexOf(organizationSearchTerm.toLowerCase()) > -1
      : organization;
  };
  // Render
  return (
    <div>
      <div className='text-center bg-[#161B22] py-14'>
        <div className='text-2xl font-bold'>Organizations</div>
        <div className='text-gray-500 text-md'>GitHub organizations outsourcing to OpenQ</div>
      </div>
      <div className='lg:grid lg:grid-cols-extra-wide xl:grid-cols-wide justify-center md:pr-3 mx-4 sm:mx-8 '>
        <div className='lg:col-start-2 justify-between justify-self-center space-y-2 w-full pb-8 max-w-[966px] mx-auto'>
          <div className='flex flex-wrap items-center justify-center gap-4 w-full pt-10'>
            <SearchBar
              onKeyUp={filterByOrg}
              searchText={organizationSearchTerm}
              placeholder='Search Organization...'
              styles={'rounded-sm w-full'}
            />
            <MintBountyButton styles={'w-full'} types={types} />
          </div>
          <Carousel height={'80'}>
            {orgs.map((org, index) => {
              return (
                <OrganizationCard key={index} index={index} organization={org} organizationIds={organizationIds} />
              );
            })}
          </Carousel>
          <div className='grid grid-cols-[repeat(3,_300px)] justify-center lg:justify-between'></div>
          <div className=''>
            {orgs
              .filter((organization) => {
                const hasSearchTerm = checkSearchTerm(organization, organizationSearchTerm);
                const hasBounties = organization?.bounties?.nodes.length > 0;
                return hasBounties && hasSearchTerm;
              })
              .map((elem, index) => {
                return <HorizontalOrganizationCard key={index} organization={elem} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationHomepage;
