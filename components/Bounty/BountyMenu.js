import React from 'react';

const BountyMenu = ({updatePage, internalMenu})=>{

	const handleClick = (e)=>{
		updatePage(e.target.innerText);

	};
	return (
	
	
		<div className=' px-4 sm:px-8 text-primary border-web-gray border-b w-full flex h-12 items-center gap-x-4 relative'>
			<button onClick={handleClick} className={`px-2 flex gap-2 items-center text-sm hover:bg-inactive-gray leading-5 px-3 py-1 hover:bg-active-gray rounded-sm justify-center w-20 ${internalMenu === 'View' && 'after:border-rust after:border-2 after:-bottom-[1px] after:w-20 after:absolute after:border-b'}`}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className='fill-muted'>
					<path fillRule="evenodd" d="M14.184 1.143a1.75 1.75 0 00-2.502-.57L.912 7.916a1.75 1.75 0 00-.53 2.32l.447.775a1.75 1.75 0 002.275.702l11.745-5.656a1.75 1.75 0 00.757-2.451l-1.422-2.464zm-1.657.669a.25.25 0 01.358.081l1.422 2.464a.25.25 0 01-.108.35l-2.016.97-1.505-2.605 1.85-1.26zM9.436 3.92l1.391 2.41-5.42 2.61-.942-1.63 4.97-3.39zM3.222 8.157l-1.466 1a.25.25 0 00-.075.33l.447.775a.25.25 0 00.325.1l1.598-.769-.83-1.436zm6.253 2.306a.75.75 0 00-.944-.252l-1.809.87a.75.75 0 00-.293.253L4.38 14.326a.75.75 0 101.238.848l1.881-2.75v2.826a.75.75 0 001.5 0v-2.826l1.881 2.75a.75.75 0 001.238-.848l-2.644-3.863z">
					</path>
				</svg>
				<span>View</span>
			</button>
			<button onClick={handleClick} className={`px-2 flex gap-2 items-center text-sm hover:bg-inactive-gray leading-5 px-3 py-1 hover:bg-active-gray rounded-sm justify-center w-20 ${internalMenu === 'Fund' && 'after:border-rust after:border-2 after:-bottom-[1px] after:w-20 after:absolute w-20 after:border-b' }`}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className='fill-muted'>
					<path fillRule="evenodd" d="M13.25 2.5H2.75a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25zM2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25V2.75C1 1.784 1.784 1 2.75 1zM8 4a.75.75 0 01.75.75v2.5h2.5a.75.75 0 010 1.5h-2.5v2.5a.75.75 0 01-1.5 0v-2.5h-2.5a.75.75 0 010-1.5h2.5v-2.5A.75.75 0 018 4z">
					</path></svg>
				<span>Fund</span>
			</button>
			<button onClick={handleClick} className={`px-2 flex gap-2 items-center text-sm hover:bg-inactive-gray leading-5 px-3 py-1 hover:bg-active-gray rounded-sm justify-center w-20 ${internalMenu === 'Refund' && 'after:border-rust after:border-2 after:-bottom-[1px] after:w-20 after:absolute w-20 after:border-b' }`}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className='fill-muted'>
					<path fillRule="evenodd" d="M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zm-2 7.75a.75.75 0 000-1.5h-6.5a.75.75 0 000 1.5h6.5z">
					</path>
				</svg>
				<span>Refund</span>
			</button>
			<button onClick={handleClick} className={`px-2 flex gap-2 items-center text-sm hover:bg-inactive-gray leading-5 px-3 py-1 hover:bg-active-gray rounded-sm justify-center w-20 ${internalMenu === 'Claim' && 'after:border-rust after:border-2 after:-bottom-[1px] after:w-20 after:absolute w-20 after:border-b' }`}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className='fill-muted'>
					<path fillRule="evenodd" d="M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.947.67 2.284-.278 3.232-.61.61-1.545.84-2.403.633a2.788 2.788 0 01-1.436-.874A3.21 3.21 0 003 10c0 2.53 2.164 4.5 4.998 4.5zM9.533.753C9.496.34 9.16.009 8.77.146 7.035.75 4.34 3.187 5.997 6.5c.344.689.285 1.218.003 1.5-.419.419-1.54.487-2.04-.832-.173-.454-.659-.762-1.035-.454C2.036 7.44 1.5 8.702 1.5 10c0 3.512 2.998 6 6.498 6s6.5-2.5 6.5-6c0-2.137-1.128-3.26-2.312-4.438-1.19-1.184-2.436-2.425-2.653-4.81z">
					</path>
				</svg>
				<span>Claim</span>
			</button>
		</div>
	);
};

export default BountyMenu;