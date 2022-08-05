import React from 'react';

const LoadingIcon = ({bg, graph, className}) => {
	return (
		<div className={className}>
			{graph?
				<div className='graph-anim-wrapper'>
					<div className="size-9"><div className="orbit size-8">
						<div className="planet-8"></div>
						<div className="orbit size-7">
							<div className="planet-7"></div>
							<div className="orbit size-6">
								<div className="planet-wrapper">
									<div className="planet-6"></div>
									<div className="planet-4"></div>
								</div>
								<div className="orbit size-5">
									<div className="planet-5"></div>
									<div className="planet-2"></div>
									<div className="orbit size-4">
										<div className="planet-3"></div>
										<div className="orbit size-2">
											<div className="orbit size-1">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					</div>
				</div>:
			
				bg == 'white' ? (
					<div>
						<svg data-testid="loading"
							className="h-5 w-5 animate-spin
		rounded-full
		h-6
		w-6
		border-t-2 border-b-2 border-purple-500"
							viewBox="0 0 24 24"
						></svg>
					</div>
				) : (
					<div>
						<svg data-testid="loading"
							className="h-5 w-5 animate-spin
				rounded-full
				h-6
				w-6
				border-t-2 border-b-2 border-white"
							viewBox="0 0 24 24"
						></svg>
					</div>
				)}
		</div>
	);
};

export default LoadingIcon;
