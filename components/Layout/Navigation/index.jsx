// Third party
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
// Custom
import StoreContext from '../../../store/Store/StoreContext';
import ConnectButton from '../../WalletConnect/ConnectButton';
import Image from 'next/image';
import { ThreeBarsIcon } from '@primer/octicons-react';
import LinkDropdown from '../../Utils/LinkDropdown';
import LoadingThread from '../../Loading/LoadingThread';
import NotificationBell from '../../Notifications/NotificationBell';
import ContractWizard from '../../ContractWizard/index';

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
    // https://stackoverflow.com/questions/4003823/javascript-getcookie-functions/4004010#4004010
    const getCookie = (c_name) => {
      var c_value = ' ' + document.cookie;
      var c_start = c_value.indexOf(' ' + c_name + '=');
      if (c_start == -1) {
        c_value = null;
      } else {
        c_start = c_value.indexOf('=', c_start) + 1;
        var c_end = c_value.indexOf(';', c_start);
        if (c_end == -1) {
          c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
      }
      return c_value;
    };
    const getNotificationCookie = () => {
      const signedKnockTokenCookie = getCookie('signed_knock_token');
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
      tokenClient.firstTenPrices = {
        ...tokenPrices,
        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': { usd: 1 },
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': { usd: 1 },
      };
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
        <div className='absolute top-12 left-0 z-50 bg-nav-bg w-full md:hidden w-60'>
          <div className='flex flex-col p-4 bg-nav-bg space-x-1 space-y-2 w-full'>
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
          </div>
        </div>
      ) : null}
      <LoadingThread />
      <div className='flex bg-nav-bg py-1 h-16 relative z-30'>
        <div className='flex visible relative w-full'>
          <div className='flex w-full md:py-1 justify-between mx-4 md:mx-8'>
            <div className='flex space-x-5 items-center'>
              <Link href={'/'} className='flex items-center md:hover:opacity-70 z-10 min-w-[31px]'>
                <Image src='/openq-logo-white-2.png' alt='OpenQ' width='31' height='31' />
              </Link>

              <div className='md:flex hidden  content-center z-50  items-center'>
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
                {/* <button onClick={() => setShowModal(true)} className='pl-4 flex items-center'>
                  <QuestionIcon size={16} className='fill-muted hover:fill-primary' />
                </button> */}
              </div>
            </div>
            <div className='md:hidden relative w-[244px] overflow-hidden right-20 font-inter text-xl self-center font-bold'>
              <svg width='404' height='40' viewBox='0 0 404 164' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M106.24 80.02C106.24 85.08 105.37 89.72 103.63 93.96C101.89 98.2 99.43 101.87 96.25 104.97C93.07 108.08 89.3 110.5 84.93 112.24C80.56 113.98 75.78 114.85 70.59 114.85C65.33 114.85 60.53 113.98 56.19 112.24C51.85 110.5 48.09 108.07 44.92 104.97C41.74 101.86 39.28 98.19 37.54 93.96C35.8 89.72 34.93 85.08 34.93 80.02C34.93 75.04 35.8 70.41 37.54 66.14C39.28 61.87 41.74 58.18 44.92 55.07C48.1 51.96 51.85 49.54 56.19 47.8C60.53 46.06 65.33 45.19 70.59 45.19C75.78 45.19 80.56 46.06 84.93 47.8C89.3 49.54 93.08 51.97 96.25 55.07C99.43 58.18 101.89 61.87 103.63 66.14C105.36 70.41 106.24 75.04 106.24 80.02ZM70.58 102.77C73.93 102.77 76.97 102.21 79.7 101.08C82.43 99.95 84.77 98.36 86.72 96.32C88.67 94.27 90.19 91.86 91.28 89.1C92.37 86.33 92.92 83.31 92.92 80.03C92.92 76.75 92.37 73.73 91.28 70.96C90.19 68.19 88.67 65.8 86.72 63.79C84.77 61.78 82.43 60.2 79.7 59.08C76.97 57.95 73.93 57.39 70.58 57.39C67.23 57.39 64.19 57.95 61.46 59.08C58.73 60.21 56.39 61.78 54.44 63.79C52.49 65.81 50.97 68.2 49.88 70.96C48.79 73.73 48.24 76.75 48.24 80.03C48.24 83.31 48.79 86.33 49.88 89.1C50.97 91.87 52.49 94.27 54.44 96.32C56.39 98.37 58.73 99.96 61.46 101.08C64.19 102.2 67.23 102.77 70.58 102.77Z'
                  fill='white'
                />
                <path
                  d='M113.71 88.63C113.71 84.53 114.38 80.83 115.71 77.51C117.04 74.2 118.89 71.36 121.24 69.01C123.6 66.65 126.43 64.83 129.74 63.53C133.05 62.23 136.72 61.58 140.76 61.58C144.72 61.58 148.38 62.25 151.72 63.58C155.07 64.91 157.95 66.76 160.38 69.11C162.8 71.47 164.68 74.28 166.02 77.56C167.35 80.84 168.02 84.39 168.02 88.22C168.02 92.73 167.29 96.64 165.82 99.95C164.35 103.26 162.44 106.03 160.08 108.25C157.72 110.47 155.04 112.13 152.04 113.22C149.03 114.31 146.03 114.86 143.02 114.86C139.19 114.86 135.83 114.11 132.93 112.61C130.03 111.11 127.76 109.06 126.12 106.46H125.91V135.15H113.72V88.63H113.71ZM140.76 72.95C136.25 72.95 132.65 74.37 129.95 77.2C127.25 80.04 125.9 83.71 125.9 88.21C125.9 92.72 127.25 96.39 129.95 99.23C132.65 102.07 136.25 103.48 140.76 103.48C145.27 103.48 148.89 102.06 151.62 99.23C154.35 96.4 155.72 92.72 155.72 88.21C155.72 83.7 154.35 80.03 151.62 77.2C148.89 74.37 145.27 72.95 140.76 72.95Z'
                  fill='white'
                />
                <path
                  d='M185.74 92.52V92.72C186.56 96.14 188.22 98.83 190.71 100.81C193.2 102.79 196.36 103.78 200.19 103.78C205.65 103.78 209.65 102.18 212.18 98.96H225.19C223.28 103.81 220.13 107.67 215.76 110.54C211.39 113.41 206.2 114.84 200.19 114.84C196.16 114.84 192.49 114.17 189.18 112.84C185.87 111.51 183 109.66 180.57 107.31C178.14 104.95 176.27 102.14 174.93 98.86C173.6 95.58 172.93 92.03 172.93 88.2C172.93 84.38 173.6 80.82 174.93 77.54C176.26 74.26 178.14 71.44 180.57 69.09C182.99 66.73 185.86 64.89 189.18 63.56C192.49 62.23 196.16 61.56 200.19 61.56C204.15 61.56 207.81 62.23 211.15 63.56C214.5 64.89 217.35 66.74 219.71 69.09C222.07 71.45 223.91 74.26 225.24 77.54C226.57 80.82 227.24 84.37 227.24 88.2V92.5H185.74V92.52ZM200.19 72.64C196.57 72.64 193.55 73.53 191.12 75.3C188.69 77.08 187 79.5 186.05 82.57V82.78H214.33V82.57C213.37 79.5 211.67 77.07 209.21 75.3C206.75 73.53 203.74 72.64 200.19 72.64Z'
                  fill='white'
                />
                <path
                  d='M272.02 113.53V87.2C272.02 82.35 270.86 78.76 268.54 76.44C266.22 74.12 263.11 72.96 259.22 72.96C255.33 72.96 252.22 74.12 249.9 76.44C247.58 78.76 246.42 82.35 246.42 87.2V113.53H234.23V87.2C234.23 82.96 234.83 79.26 236.02 76.08C237.21 72.9 238.9 70.24 241.09 68.09C243.28 65.94 245.91 64.32 248.98 63.22C252.05 62.13 255.47 61.58 259.23 61.58C262.99 61.58 266.4 62.11 269.48 63.17C272.55 64.23 275.18 65.83 277.37 67.99C279.56 70.14 281.25 72.82 282.44 76.03C283.63 79.24 284.23 82.96 284.23 87.2V113.53H272.02Z'
                  fill='white'
                />
                <path
                  d='M314.95 112.25C310.61 110.51 306.85 108.08 303.68 104.98C300.5 101.87 298.04 98.2 296.3 93.97C294.56 89.73 293.69 85.09 293.69 80.03C293.69 75.05 294.56 70.42 296.3 66.15C298.04 61.88 300.5 58.19 303.68 55.08C306.86 51.97 310.61 49.55 314.95 47.81C319.29 46.07 324.09 45.2 329.35 45.2C334.54 45.2 339.32 46.07 343.69 47.81C348.06 49.55 351.84 51.98 355.01 55.08C358.19 58.19 360.65 61.88 362.39 66.15C364.13 70.42 365 75.05 365 80.03C365 85.09 364.13 89.73 362.39 93.97C360.65 98.21 358.19 101.88 355.01 104.98C353.05 106.9 352.7 107.41 350.29 108.81M329.35 102.77C332.7 102.77 335.74 102.21 338.47 101.08C341.2 99.95 343.54 98.36 345.49 96.32C347.44 94.27 348.96 91.86 350.05 89.1C351.14 86.33 351.69 83.31 351.69 80.03C351.69 76.75 351.14 73.73 350.05 70.96C348.96 68.19 347.44 65.8 345.49 63.79C343.54 61.78 341.2 60.2 338.47 59.08C335.74 57.95 332.7 57.39 329.35 57.39C326 57.39 322.96 57.95 320.23 59.08C317.5 60.21 315.16 61.78 313.21 63.79C311.26 65.81 309.74 68.2 308.65 70.96C307.56 73.73 307.01 76.75 307.01 80.03C307.01 83.31 307.56 86.33 308.65 89.1C309.74 91.87 311.26 94.27 313.21 96.32C315.16 98.37 317.5 99.96 320.23 101.08C322.96 102.2 326 102.77 329.35 102.77ZM350.29 108.8L366.05 111.64L363.89 123.64L337.97 118.98C333.8 118.23 317.18 113.72 314.27 111.98'
                  fill='white'
                />
              </svg>
            </div>
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
              <button className='flex md:hidden z-10 pr-4' onClick={() => setOpenMenu(!openMenu)}>
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
