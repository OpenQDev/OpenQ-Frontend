// Third party
import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../store/Store/StoreContext';

// Custom

export default function Index({ orgs, fullBounties, batch }) {
	return (
		<div>
			<div className="flex font-mont text-xl justify-center pt-56">
        What do you want to do today?
			</div>
			<div className="flex justify-center pt-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="#898989"
					strokeWidth="2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
		</div>
	);
}
