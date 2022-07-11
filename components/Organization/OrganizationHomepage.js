// Third party
import React, { useState } from "react";
// Custom
import OrganizationCard from "../Organization/OrganizationCard";
import MintBountyButton from "../MintBounty/MintBountyButton";
import SearchBar from "../Search/SearchBar";

const OrganizationHomepage = ({ orgs }) => {
  // State
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState("");

  const filterByOrg = (e) => {
    setOrganizationSearchTerm(e.target.value);
  };

  // Render
  return (
    <div className="lg:grid lg:grid-cols-extra-wide xl:grid-cols-wide justify-center">
      <div className="lg:col-start-2 justify-between justify-self-center space-y-2 w-full pb-8">
        <div className="grid gap-6 lg:grid-cols-[repeat(4,_1fr)] w-full">
          <SearchBar
            onKeyUp={filterByOrg}
            searchText={organizationSearchTerm}
            placeholder="Search Organization..."
            className="mb-200"
          />
          <MintBountyButton />
        </div>
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
  );
};

export default OrganizationHomepage;
