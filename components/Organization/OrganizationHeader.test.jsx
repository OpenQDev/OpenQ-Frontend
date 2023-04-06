import React from 'react';
import OrganizationHeader from '../../components/Organization/OrganizationHeader';
import renderer from 'react-test-renderer';
import Constants from '../../test-utils/constant';

const organizationData = Constants.organizationData;

describe('OrganizationHeader', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<OrganizationHeader organizationData={organizationData} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
