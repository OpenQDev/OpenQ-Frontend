// Third party
import React, { useEffect, useContext, useState } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import SearchBar from '../../components/Search/SearchBar';
import PrCard from '../../components/ShowCase/PrCard';

const showcase = () => {

	const [appState] = useContext(StoreContext);
	const [prs, setPrs] = useState([]);
	const [ submissionSearchTerm, setSubmissionSearchTerm ] = useState('');
	// Render
	const filterBySubmission = (e)=>{
		setSubmissionSearchTerm(e.target.value);
		console.log(e.target.value);
	};
	useEffect(async()=>{
		const batch = 100;
		const newBounties = await appState.openQSubgraphClient.getAllBounties('desc', 0, batch);
		const parsePrs = (responseData)=>{return responseData.data.nodes.map(node=>node.timelineItems.edges.map(edge=>{return {...edge.node.source, issueId: node.id, address: newBounties.find(bounty=>bounty.bountyId===node.id).bountyAddress};})).flat().filter(elem=>elem.id);};
		const result =	await appState.githubRepository.fetchPRsByIssues(newBounties.map(bounty=>bounty.bountyId));
		setPrs(parsePrs(result));
	},[]);


	return (
		<>
						
			<div className="lg:grid lg:grid-cols-extra-wide mx-4 pt-8 sm:mx-8 xl:grid-cols-wide justify-center">
				<h1 className='lg:col-start-2 justify-between justify-self-center py-16 text-4xl font-bold text-tinted'>Submissions</h1>
				<div className="lg:col-start-2 justify-between justify-self-center space-y-3 w-full pb-8 max-w-[850px]">
					<SearchBar onKeyUp={filterBySubmission} searchText={submissionSearchTerm} placeholder="Search Submissions..." borderShape={'border rounded-full w-full'}  />
					<div className="grid grid-cols-[repeat(_auto-fill,_240px)] gap-y-16 pt-6 justify-center lg:justify-between mx-auto">
						{prs.filter(pr=>{
							const searchable = pr.bodyText.toLowerCase() + pr.title.toLowerCase();
							return searchable.includes(submissionSearchTerm.toLowerCase()) || submissionSearchTerm==='';
						}).map((pr, index)=><PrCard key={index} pr={pr} />)}

					</div>
				</div>
			</div>
		</>
	);

};


export default showcase;
