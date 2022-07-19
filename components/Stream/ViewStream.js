import React, { useContext, useEffect, useState } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import Stream from './Stream';

const ViewStreams = () => {
	const {account} = useWeb3();
	const [superfluidData, setSuperfluidData ] = useState();
	const [appState] = useContext(StoreContext);
	useEffect(async()=>{
		if(account){
			const value = await appState.superfluidClient.viewAccount(account);
			console.log(value);
			setSuperfluidData(value.data.account);
		}
	},[account]);

	return (
		<div className="mt-8">
			
			<section>
				<h2 className='text-center font-bold text-tinted text-3xl'>Your Inflows</h2>
				<div className='my-8'>	{superfluidData&&superfluidData.inflows.map((elem, index)=><Stream key={index}  direction={'in'} stream ={elem}/>)}</div>
			</section>

			<section>
				<h2 className='text-center font-bold text-tinted text-3xl'>Your Outflows</h2>
				<div className='my-8'>	{superfluidData&&superfluidData.outflows.map((elem, index)=><Stream key={index} direction={'out'} stream ={elem}/>)}</div>
			</section>
		
		</div>
	);
};

export default ViewStreams;