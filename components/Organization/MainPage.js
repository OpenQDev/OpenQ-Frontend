

import React, { useState} from 'react'; 
import Image from 'next/image';
import OrganizationHeader from './OrganizationHeader';
import BountyMenu from '../Bounty/BountyMenu';
import RepoCard from './RepoCard';
import BountyList from '../BountyList/BountyList';
import Home from '../svg/home';
import Question from '../svg/question';

const Organization = ({bounties, isLoading, getMoreData, complete, getNewData, organizationData})=>{
	const [toggleVal, setToggleVal] = useState('Overview');
	const handleToggle = (toggleVal)=>{
		setToggleVal(toggleVal);
	};
	const repositories = bounties.reduce((repositories, bounty)=>{
		if (repositories.some(repo=>repo.name===bounty.repoName)){
			return repositories;
		}
		return [...repositories, {name: bounty.repoName, languages: bounty.languages, description: bounty.repoDescription}];
	
	},[]);
	const languages = repositories.reduce((languages, repository)=>{
		const newLanguages = repository.languages.filter(currentLanguage=>!languages.some(language=>currentLanguage.name ===language.name));
	
		return [...languages, ...newLanguages];
	},[]);
	
	return (
		<div className='w-full mx-auto text-primary mt-1 px-4 md:px-16 max-w-[1420px] '>
			<OrganizationHeader organizationData={organizationData} />
			<BountyMenu  items={[{name: 'Overview', Svg: Home },{name: 'About', Svg: Question },]} internalMenu={toggleVal} updatePage={handleToggle}/>
			{toggleVal === 'Overview' && <div className='px-4 py-3 gap-6 w-full flex flex-wrap'>
				<div className='w-full max-w-[960px]'>
					<h2 className="text-primary w-full mb-2">Active Repos</h2>
					<div className='grid md:grid-cols-[1fr_1fr] gap-4 pb-5'>
						{repositories.map((repository, index)=> <RepoCard key={index} repository = {repository}/>)}
				
					</div>

					<h2 className="text-primary w-full mb-2">Smart Contracts</h2>
					<BountyList  bounties={bounties} loading={isLoading} getMoreData={getMoreData} complete={complete} getNewData={getNewData}  />
				</div>
				<ul className=' w-fit max-w-[960px]'>
			
					{organizationData.membersWithRole.nodes.length >0 && <li className='border-b border-web-gray pt-3 pb-6'>
						<div className='text-normal text-primary pb-3'>People</div>
						<div className='flex gap-2 flex-wrap'>
							{organizationData.membersWithRole.nodes.map((member, index)=>{return <Image key={index} className='rounded-lg' height={36} width={36} src={member.avatarUrl}/>;
						
							})}</div>
					</li>}	{languages.length >0 && <li className='border-b border-web-gray pb-8'>
					
						<div className='text-normal text-primary py-4 flex'>Top Languages</div>
						<div className='flex flex-wrap gap-2 w-60'>	{languages.map(language=>{
							return <>
						
								<div className='w-fit inline' >	<div style={{backgroundColor: language.color}} className='w-3 h-3 rounded-lg inline-block'></div> <span className='text-sm'>{language.name}</span></div>
							
							</>;})}	</div>
					</li>
					}
			
			
				
			
				</ul>
			</div>}
		</div>

	);
};

export default Organization;