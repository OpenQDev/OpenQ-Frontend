// Third party
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
// Custom
import StoreContext from '../../store/Store/StoreContext.js';
import ConnectButton from '../WalletConnect/ConnectButton.js';
import Image from 'next/image';
import { QuestionIcon, ThreeBarsIcon } from '@primer/octicons-react';
import LinkDropdown from '../Utils/LinkDropdown';
import NavLinks from './NavLinks';
import LoadingThread from '../Loading/LoadingThread.js';
import NotificationBell from '../Notifications/NotificationBell.js';
import ContractWizard from '../ContractWizard';

const Navigation = () => {
  const [appState] = useContext(StoreContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const includeSearch = false;
  const [items, setItems] = useState([]);
  const [searchable, setSearchable] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notificationToken, setNotificationToken] = useState(null);
  const { openQSubgraphClient, openQPrismaClient, utils, githubRepository, tokenClient } = appState;
  const { accountData } = appState;

  useEffect(() => {
    const getNotificationCookie = async () => {
      // regex for signed_knock_token cookie
      const signedKnockTokenCookie = document.cookie.match(/(signed_knock_token=)(.*?)+/)[0].slice(19);

      console.log(signedKnockTokenCookie);
      setNotificationToken(signedKnockTokenCookie);
    };

    getNotificationCookie();
  });

  useEffect(() => {
    // set up searchable
    const fetchSearch = async () => {
      try {
        const subgraphOrganizations = await openQSubgraphClient.getOrganizationIds();
        const prismaContracts = await openQPrismaClient.getAllContracts();

        const githubOrganizations = await githubRepository.searchOrgOrUser(
          subgraphOrganizations.organizations.map((organization) => organization.id)
        );
        const prismaOrganizations = await openQPrismaClient.getLeanOrganizations(
          subgraphOrganizations.organizations.map((organization) => organization.id)
        );

        const subgraphBounties = await openQSubgraphClient.getBountyIds();
        const githubIssues = await githubRepository.getLeanIssueData(subgraphBounties.map((bounty) => bounty.bountyId));
        const fullOrgs = githubOrganizations
          .map((organization) => {
            const prismaOrg = prismaOrganizations.find((prismaOrganization) => {
              return prismaOrganization.id === organization.id;
            });
            return { ...organization, ...prismaOrg };
          })
          .filter((org) => !org.blacklisted);
        const fullBounties = utils
          .combineBounties(subgraphBounties, githubIssues, prismaContracts)
          .filter((bounty) => !bounty.blacklisted && !bounty.organization.blacklisted);
        const searchable = [...fullBounties, ...fullOrgs].map((searchableItem) => {
          const url = searchableItem.title
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/contract/${searchableItem.bountyId}/${searchableItem.bountyAddress}`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/organization/${searchableItem.login}`;
          const name = searchableItem.name || searchableItem.title || searchableItem.login;
          const searchItemUrl = searchableItem.url;
          return {
            name: name.toLowerCase(),
            searchUrl: searchItemUrl,
            url,
            isIssue: searchableItem.title,
          };
        });
        setSearchable(searchable);
      } catch (err) {
        appState.logger.error(err, accountData.id, 'Navigation.js1');
      }
      // set up gnosis safe
    };
    const fetchPrices = async () => {
      // set up tokens
      let tokenPrices = {};

      try {
        tokenPrices = (await tokenClient.getPrices()) || {};
      } catch (err) {
        appState.logger.error(err, accountData.id, 'Navigation.js2');
      }
      tokenClient.firstTenPrices = tokenPrices;
    };
    if (includeSearch) {
      fetchSearch();
    }
    fetchPrices();
  }, []);

  const handleSearch = (e) => {
    setQuickSearch(e.target.value);

    const names = searchable
      .filter((searchableItem) => {
        return (
          searchableItem.name.includes(e.target.value.toLowerCase()) ||
          searchableItem.searchUrl.toLowerCase().includes(e.target.value.toLowerCase())
        );
      })
      .map((searchableItem) => searchableItem);
    setItems(e.target.value ? names.slice(0, 5) : []);
  };

  return (
    <>
      {openMenu ? (
        <div className='absolute top-12 left-0 z-10 bg-nav-bg w-full md:hidden w-60'>
          <div className='flex flex-col p-4 z-10 bg-nav-bg space-x-1 space-y-2 w-full'>
            {includeSearch && (
              <div className='flex-col mr-2 h-7  group'>
                <input
                  className='flex pr-4 items-center input-field'
                  onChange={handleSearch}
                  value={quickSearch}
                  type='text'
                  placeholder='Search OpenQ'
                ></input>
                {quickSearch && <LinkDropdown items={items} />}
              </div>
            )}
            <NavLinks appState={appState} setOpenMenu={setOpenMenu} />
          </div>
        </div>
      ) : null}
      <LoadingThread />
      <div className='flex bg-nav-bg py-1 h-16 relative z-10'>
        <div className='flex visible relative w-full'>
          <div className='flex w-full md:py-1 justify-between mx-4 md:mx-8'>
            <div className='flex space-x-5 items-center'>
              <Link href={'/'} className='flex items-center md:hover:opacity-70 min-w-[31px]'>
                <Image src='/openq-logo-white-2.png' alt='OpenQ' width='31' height='31' />
              </Link>

              <div className='md:flex hidden  content-center  items-center'>
                {includeSearch && (
                  <div className='flex-col justify-center mr-2 h-7 group '>
                    <input
                      className={`md:flex hidden pr-4 items-center focus:w-80 w-60  left-0 input-field transition-all  ease-in-out duration-700 ${
                        quickSearch && 'focus:w-80'
                      }`}
                      onChange={handleSearch}
                      value={quickSearch}
                      type='text'
                      placeholder='Search OpenQ'
                    ></input>
                    {quickSearch && <LinkDropdown items={items} />}
                  </div>
                )}
                <NavLinks appState={appState} setOpenMenu={setOpenMenu} />
                <button onClick={() => setShowModal(true)} className='pl-4 flex items-center'>
                  <QuestionIcon size={16} className='fill-muted hover:fill-primary' />
                </button>
              </div>
            </div>
            <div className='md:hidden font-inter text-xl self-center font-bold'>OpenQ</div>
            <div className='flex items-center text-[0.8rem] md:text-[1rem]'>
              <div className='pr-4 md:block hidden'>
                {notificationToken && accountData.github ? (
                  <NotificationBell userId={accountData.github} notificationToken={notificationToken} />
                ) : null}
              </div>
              <div className='pr-4 md:block hidden'>
                <ConnectButton
                  needsGithub={true}
                  nav={true}
                  tooltipAction={"start using all of OpenQ's features"}
                  centerStyles={true}
                />
              </div>
              <button className='flex md:hidden pr-4' onClick={() => setOpenMenu(!openMenu)}>
                <ThreeBarsIcon size={24} />
              </button>
            </div>
          </div>
        </div>

        {showModal && <ContractWizard wizardVisibility={setShowModal} />}
      </div>
    </>
  );
};

export default Navigation;
