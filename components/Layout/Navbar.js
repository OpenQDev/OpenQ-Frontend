// Third Party
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Custom
import { useMediaQuery } from '../../scripts/useMediaQuery';

const Navbar = ({ children }) => {
	let isPageWide = useMediaQuery('(min-width: 500px)');
	const [isClosed, setClosed] = useState(isPageWide);
	let menuRef = useRef();

	useEffect(() => {
		if (!isClosed) {
			let handler = (event) => {
				if (!menuRef.current.contains(event.target) && !isPageWide) {
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
		<div className="flex">
			<div className="flex fixed top-0 left-0 h-screen">
				{!isClosed && (
					<div
						ref={menuRef}
						className="bg-dark-mode w-20 flex min-h-screen flex-col border-r border-web-gray"
					>
						{/*  <div class="bg-white broder-r broder-b px-4 h-10 flex items-center">
            {" "}
            <span>Application</span>
          </div> */}
						;
						<nav className="text-white flex flex-col space-y-4 items-center pt-1 flex-grow">
							<div className="pb-8">
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
							</div>
							{/* <div className="navbar-icon">
                <Link href="/">
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="#ededed"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </a>
                </Link>
              </div> */}
							{/* <Link href="/stats">
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </a>
              </Link> */}
							{/* <div className="pt-2">
								<Link href="/claim">
									<a>
										<Image
											src="/eth-white.png"
											alt="OpenQ"
											width="24"
											height="24"
										/>
									</a>
								</Link>
							</div> */}
							{/*  <div className="">
              
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="gray"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              
              </div> */}
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
