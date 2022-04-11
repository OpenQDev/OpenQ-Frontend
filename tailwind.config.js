// const colors = require('tailwindcss/colors');

/*CHECK DOC ABOUT extensio parameters vs theem*/
module.exports = {
	mode: 'jit',
	purge: ['./components/**/*.js', './pages/**/*.js'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		borderRadius: {
			none: '0',
			sm: '0.125rem',
			DEFAULT: '4px',
			md: '0.375rem',
			lg: '1.7rem',
			xl: '2.5rem',
			full: '9999px',
			large: '12px',
		},
		borderColor: (theme) => ({
			...theme('colors'),
			DEFAULT: theme('colors.gray.300', 'currentColor'),
			menu: '#4c4c4c',
			primary: '#3490dc',
			secondary: '#ffed4a',
			danger: '#e3342f',
		}),
		extend: {
			boxShadow: {
				inner: 'inset 0 -2px 3px 0 rgba(0, 0, 0, 0.06)',
			},
			colors: {
				'dark-mode': '#121212',
				'overlay': '#000000dd',
				'button-pink': '#FF006A',
				'web-gray': '#585858',
				'inactive-gray': '#232528',
				'active-gray': '#1B1C1D',
				'input-color': '#C45454',
				'inactive-accent': '#EC4899',
				'active-accent': '#f9a8d4',
				'inactive-accent-inside': '#341220',
				'claimed-bounty':'#7E22CE',
				'claimed-bounty-inside': '#2B183D',
				'button': '#F9A8D4',
				'button-inside': '#241219',
				'button-inside-hover': '#461429',
				'green-inside': '#293e30',
				'green': '#22c55e',
				'tinted': '#D1D5DB'

			},
			fontFamily: {
				mont: '\'Montserrat\', sans-serif;',
			},
			width: {
				'1/7': '14.2857143%',
				'2/7': '28.5714286%',
				'3/7': '42.8571429%',
				'4/7': '57.1428571%',
				'5/7': '71.4285714%',
				'6/7': '85.7142857%',
			},
			screens: {
				xs: { max: '639' },
				// => @media (min-width: 380px) { ... }

				sm: '640px',
				// => @media (min-width: 640px) { ... }

				md: '768px',
				// => @media (min-width: 768px) { ... }

				lg: '1024px',
				// => @media (min-width: 1024px) { ... }

				xl: '1280px',
				// => @media (min-width: 1280px) { ... }

				'2xl': '1536px',
				// => @media (min-width: 1536px) { ... }
			},
		},
		gridTemplateColumns: {
			'wide': '1fr 2fr 1fr',
			'extra-wide': '.5fr 3fr .5fr',
			'annoying': 'repeat( auto-fit, 192px)',
		},
		keyframes: {
			bump: {
				'0%':{
					transform: 'translate(0, 0)'
				},
				'50%':{
					transform: 'translate(0, -.1rem)  scale(1.10)'
				},
			
				'100%':{
					transform: 'translate(0, 0) scale(1.10)',
				},	
			},
			spin: {
				'0%': {
					transform: 'rotate(0deg)'
				},
				'100%': {
					transform: 'rotate(360deg)'
				}
			}	
		},
		animation: {
			'single-bounce': 'bump 1s ease-in-out forwards',
			'spin':'spin 1s linear infinite'
		}
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
