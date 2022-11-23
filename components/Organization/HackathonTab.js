import React, { useEffect, useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import Link from 'next/link';
import SubmissionCard from '../Submissions/SubmissionCard';
import { getNonBlacklisted } from '../../services/utils/lib';

const HackathonTab = ({ repositories, organization }) => {
  console.log(repositories);
  const [displayRepos, setDisplayRepos] = useState([]);
  const [appState] = useContext(StoreContext);
  const [totalCount, setTotalCount] = useState({});
  console.log(totalCount);
  useEffect(() => {
    const getPrs = async () => {
      let localCount = {};

      if ((organization, repositories)) {
        const org = organization.login;
        let currentRepos = await Promise.all(
          repositories.map(async (repo) => {
            // get nonBlacklisted repos
            const { nonBlacklisted, totalCount } = await getNonBlacklisted(appState, repo.name, org);

            setTotalCount({ ...localCount, [repo.name]: totalCount });
            localCount = { ...totalCount, [repo.name]: totalCount };
            const prs = nonBlacklisted;

            return { name: repo.name, prs, id: repo.id };
          })
        );
        const repos = await appState.openQPrismaClient.getRepositories({ organizationId: organization.id });

        const blacklistedRepoIds = repos.filter((repo) => repo.hackathonBlacklisted).map((repo) => repo.id);

        const reposNotHackathonBlacklisted = currentRepos.filter((repo) => {
          return !blacklistedRepoIds.includes(repo.id);
        });
        setDisplayRepos(reposNotHackathonBlacklisted);
      }
    };
    const updatePrs = async () => {
      await getPrs();
    };
    updatePrs();
  }, []);
  return (
    <div className='  w-full  sm:px-8 flex-wrap max-w-[1028px] pb-8 '>
      <div className='lg:col-start-2 justify-start justify-self-center space-y-3 w-full pb-8'>
        {displayRepos.map((repo) => {
          return (
            <div key={repo.name}>
              <h2 className='lsm:text-[32px] text-4xl py-8 pb-4 flex-1 leading-tight min-w-[240px] pr-20'>
                Submissions for {repo.name}
              </h2>

              <div className='grid gap-8 w-full pt-8 justify-between justify-items-start grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]'>
                {repo.prs.map((pr, index) => {
                  return <SubmissionCard key={index} pr={pr} />;
                })}
              </div>
              {totalCount[repo.name] > repo.prs.length && (
                <Link href={`/showcase/${organization.login}/${repo.name}`}>
                  <div className='flex underline items-center gap-4 lsm:text-[32px] text-2xl py-8 flex-1 leading-tight min-w-[240px] pr-20'>
                    <div className=''>{totalCount[repo.name] - repo.prs.length} more submissions</div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='fill-primary'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                    >
                      <path
                        fillRule='evenodd'
                        d='M13.22 19.03a.75.75 0 001.06 0l6.25-6.25a.75.75 0 000-1.06l-6.25-6.25a.75.75 0 10-1.06 1.06l4.97 4.97H3.75a.75.75 0 000 1.5h14.44l-4.97 4.97a.75.75 0 000 1.06z'
                      ></path>
                    </svg>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HackathonTab;
