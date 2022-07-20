// Third party
import React, { useState } from "react";
// Custom
import OrganizationCard from "../Organization/OrganizationCard";
import MintBountyButton from "../MintBounty/MintBountyButton";
import SearchBar from "../Search/SearchBar";
import Carousel from "../Utils/Carousel";

const OrganizationHomepage = ({ orgs }) => {
  // State
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState("");

  const filterByOrg = (e) => {
    setOrganizationSearchTerm(e.target.value);
  };

  // Render
  return (
		<div>
			<div className="text-center bg-[#161B22] py-14">
					<div className="text-2xl font-bold">Organizations</div>
					<div className="text-gray-500 text-md">GitHub organizations outsourcing to OpenQ</div>
				</div>
    <div className="lg:grid lg:grid-cols-extra-wide xl:grid-cols-wide justify-center">
				
      <div className="lg:col-start-2 justify-between justify-self-center space-y-2 w-full pb-8">
			
        <div className="grid gap-5 lg:grid-cols-[repeat(4,_1fr)] w-full pt-10">
          <SearchBar
            onKeyUp={filterByOrg}
            searchText={organizationSearchTerm}
            placeholder="Search Organization..."
            className="mb-200"
          />
          <MintBountyButton />
        </div>
				<Carousel/>
        <div className="grid grid-cols-[repeat(3,_300px)] justify-center lg:justify-between">
          {orgs
            .filter((organization) => {
              return organizationSearchTerm
                ? organization.name
                    .toLowerCase()
                    .indexOf(organizationSearchTerm.toLowerCase()) > -1
                : organization;
            })
            .map((organization) => {
              return (
                <div className="pt-5" key={organization.id}>
                  <OrganizationCard
                    organization={organization}
                    key={organization.id}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
		</div>
  );
};

export default OrganizationHomepage;
