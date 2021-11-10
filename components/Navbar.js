// Third Party
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Custom
import { useMediaQuery } from '../scripts/useMediaQuery';

const Navbar = ({ children }) => {
	let isPageWide = useMediaQuery('(min-width: 500px)');
	const [isClosed, setClosed] = useState(isPageWide);
	let menuRef = useRef();

	useEffect(() => {
		if (!isClosed) {
			let handler = (event) => {
				if (!menuRef.current.contains(event.target)) {
					setClosed(true);
				}
			};

			window.addEventListener('mousedown', handler);

			return () => {
				window.removeEventListener('mousedown', handler);
			};
		}
	});

	return (
		<div className="flex flex-row">
			<div className="flex">
				{!isClosed && (
					<div
						ref={menuRef}
						className="bg-menu-black  w-20 flex min-h-screen flex-col"
					>
						{/*  <div class="bg-white broder-r broder-b px-4 h-10 flex items-center">
            {" "}
            <span>Application</span>
          </div> */};

						<nav className="text-white flex flex-col space-y-4 items-center pt-4 flex-grow">
							<Link href="/">
								<a href="">
									<Image
										src="/openq-logo.png"
										alt="OpenQ"
										width="31"
										height="31"
									/>
								</a>
							</Link>
							<Link href="/">
								<a href="">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
									</svg>
								</a>
							</Link>
							<a href="">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
								</svg>
							</a>
							<a href="">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" />
								</svg>
							</a>
							<a href="">
								<Image
									src="/eth-white.png"
									alt="OpenQ"
									width="25"
									height="25"
								/>
							</a>
						</nav>
					</div>
				)}
				<main className="flex-grow pt-5 flex">
					<header className="h-10 flex">
						{isClosed && (
							<div className={'flex flex-grow px-3'}>
								<button
									aria-label="open menu"
									title="Open menu"
									className="w-10 p-1"
									onClick={() => setClosed(false)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								</button>
							</div>
						)}
					</header>
				</main>
			</div>
			<div className="flex-grow">{children}</div>
		</div>
	);
};

export default Navbar;
