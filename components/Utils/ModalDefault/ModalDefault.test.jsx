import React from 'react';
import ModalDefault from '.';
import renderer from 'react-test-renderer';

const title = 'My Title';
const children = <div>My Children</div>;
const footerLeft = <div>My left footer</div>;
const footerRight = <div>My right footer</div>;

describe('ModalDefault', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(
      <ModalDefault title={title} footerLeft={footerLeft} footerRight={footerRight}>
        {children}
      </ModalDefault>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
