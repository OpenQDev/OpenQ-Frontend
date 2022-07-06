import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import {ethers} from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const ShowCasePage = ({pr, bounty}) => {
	const {isAddress} = ethers.utils;
	const [showForm, setShowForm ] = useState();
	const [contributorData, setContributorData] = useState([]);
	const [address, setAddress] = useState('');
	const [error, setError] = useState('Url not valid.');
	const [userId, setUserId] = useState();
	const [appState] = useContext(StoreContext);
	const openContributorForm = ()=>{
		setShowForm (!showForm);
	};
	const getOffChainData = async()=>{

		const result = await appState.openQPrismaClient.getPr(pr.id);
		if(result.pr){
			const userResult = await appState.githubRepository.fetchUsersByIds(result.pr.contributorIds);
			const contributors= userResult.map(githubData=>{
				const address = result.pr.contributors.find(contributor=>contributor.userId===githubData.id);
				return {...githubData,address };
			});
			setContributorData(contributors);
		}
		else{
			await appState.openQPrismaClient.createPr(pr.id, bounty.bountyAddress, pr.author.avatarUrl);

			
		}};
	useEffect(async()=>{
		try{
			await getOffChainData();
		}
		catch(err){
			console.log(err);
			
		}
	},[]);



	const fetchGithub = async(e)=>{
	
		const url = e.target.value;
		const validUrl =	  appState.utils.userUrlRegex(url);
		if(validUrl) {
			if(isAddress(address)||address.length===0){
				setError();     }
			else{	setError('Invalid address');}
		
			try{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
				const result = await appState.githubRepository.fetchUserByUrl(url);
				const isNew = !contributorData.some(datum=>datum.id===result);
				if(isNew){
					setUserId(result);		
				}
				else{
					setError('The user you are trying to add is already a contributor.');}
				
			}
			catch(err){
				setError('The user you are trying to add doesn\'t exist.');
			}
		}
		else{
			setError('Not a valid user url.');
		}                
	};
		

	const saveContributor = async()=>{
		if(!error){
			const result =	await 	appState.openQPrismaClient.addContributor(pr.id, userId, address);
			if(result.addContributor){
				setUserId();
				setAddress();
				setShowForm();
			
				try{
			
					await getOffChainData();
				}
				catch(err){
					console.log(err);
				}
			
			}
		}
	};

	const handleAddress = (e)=>{
		setAddress(e.target.value);
		if(isAddress(e)&&error==='Invalid Address')setError();
	};
	

	return (
		<div className="m-auto pt-8 w-3/4">
			<h1 className='text-4xl text-tinted font-bold'>{pr.title}</h1>
			<Link href={pr.url}>
				<a className='text-tinted font-bold underline'>
						View Source
				</a>
			</Link>
			<div className='pt-8 text-lg'>	<div className='markdown-body' dangerouslySetInnerHTML={{__html: pr.bodyHTML}}></div>
				<div className='pt-16 '>Created by</div>
				<div className='flex gap-2 h-6'>
					<div>{pr.author.login}</div>
					<Link href={pr.author.url}>
						<a>
						
							<Image className='rounded-lg' src={pr.author.avatarUrl} height={'32px'} width={'32'} />
						</a>
					</Link>
				</div>{bounty.closer?.id?.length===42 && <CopyAddressToClipboard clipping={[5, 39]} data={bounty.closer.id}/>}
			
			</div>
			{showForm && 
			<div>
				<div className='flex content-center items-center mt-4 gap-4'>
					<input onChange={fetchGithub} className='bg-dark-mode border border-web-gray p-2 rounded-full' placeholder='https://github.com/contributor-name'/>
					<input onChange={handleAddress} className='bg-dark-mode border border-web-gray p-2 rounded-full' placeholder={'polygon address'}value={address}/>
		
					<button onClick={saveContributor}>
			
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
							<path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
						</svg>
				
					</button>
					<button onClick={()=>{setShowForm(false);}}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
							<path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg> </button>
				</div>	{error &&	<div>{error}</div>}
			</div>
			
			
			
			}
			{	!showForm ?
				<button onClick={openContributorForm} className=''>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mt-2" fill="hover:black" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</button>:null}
			<h3>Contributors</h3>
			{contributorData.map((contributor, index)=>{

				return 		<div className='py-2' key={index}>

					<div className='flex gap-2 h-6'>
						<div>{contributor.login}</div>
						<Link href={contributor.url}>
							<a>
						
								<Image className='rounded-lg' src={contributor.avatarUrl} height={'32px'} width={'32'} />
							</a>
						</Link>
					</div>{bounty.closer?.id?.length===42 && <CopyAddressToClipboard clipping={[5, 39]} data={bounty.closer.id}/>}
				</div>;


			})}

		</div>);
};
export default ShowCasePage;