import React from 'react';
import SubMenu from '../../components/Utils/SubMenu';
import ButtonAndSearch from '../../components/Utils/ButtonAndSearch';

const PageHeader = ({ children, menuState, titleLine, items, handleSearchInput, searchText, CTAButton }) => {
  const [internalMenu, setInternalMenu] = menuState;
  const { Title, SubTitle } = titleLine;

  return (
    <>
      <SubMenu styles={'justify-center'} items={items} internalMenu={internalMenu} updatePage={setInternalMenu} />
      <div className='text-center bg-[#161B22] py-14 '>
        <div className='text-2xl font-bold'>
          <Title />
        </div>
        <div className='text-gray-500 text-md'>
          <SubTitle />
        </div>
      </div>
      <div className='lg:grid lg:grid-cols-extra-wide xl:grid-cols-wide justify-center md:pr-3 mx-4 sm:mx-8'>
        <div className='lg:col-start-2 justify-between justify-self-center space-y-4 w-full pb-8 max-w-[960px] mx-auto'>
          <div className='flex flex-wrap gap-4 w-full items-center pt-10'>
            <ButtonAndSearch handleSearchInput={handleSearchInput} searchText={searchText} CTAButton={CTAButton} />
          </div>
          {children}
        </div>
      </div>
    </>
  );
};
export default PageHeader;
