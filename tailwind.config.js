// const colors = require('tailwindcss/colors');

/*CHECK DOC ABOUT extensio parameters vs theem*/
module.exports = {
	mode: 'jit',
	content: ['./components/**/*.js', './pages/**/*.js', "./services/utils/Utils.js"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		borderRadius: {
			none: '0',
			sm: '0.4rem',
			DEFAULT: '4px',
			md: '0.9rem',
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
				'dark-mode': '#0D1117',
				'nav-bg': '#161B22',
				'nav-text': '#f0f6fc',
				'menu-bg': '#0D1117',
				'border-gray': '#30363D',
				'border-active': 'rgb(139, 148, 158)',
				'subtle': 'rgb(22, 27, 34)',
				'input-gray': '#C2C3C5',
				'overlay': '#000000dd',
				'link-colour': '#39A6FF',
				'dropdown-hover': 'rgba(110, 118, 129, 0.1)',
				'primary': 'rgb(201, 209, 217)',
				'muted': 'rgb(139, 148, 158)',
				'border-default': 'rgba(144, 153, 162, 0.706)',
				'button-pink': '#FF006A',
				'secondary-button': 'rgb(31, 111, 235)',
				'important-button': 'rgb(35, 134, 54)',
				'rust': "#f78166",
				'closed': "rgb(137, 87, 229)",
				'danger': "#da3633",
				'dropdown': "rgb(48, 54, 61)",
				'web-gray': '#30363d',
				'inactive-gray': 'rgb(33, 38, 45)',
				'active-gray': 'rgb(40, 46, 53)',
				'input-color': '#C45454',
				'inactive-accent': '#EC4899',
				'active-accent': '#f9a8d4',
				'inactive-accent-inside': '#341220',
				'claimed-bounty': '#7E22CE',
				'claimed-bounty-inside': '#2B183D',
				'button': '#F9A8D4',
				'button-inside': '#241219',
				'button-inside-hover': '#461429',
				'green-inside': '#293e30',
				'green-highlight': '#2ea043',
				'green': '#238636',
				'tinted': '#b7b9bc'

			},
			fontFamily: {
				mont: '\'Montserrat\', sans-serif;',
				collegiate: ['Collegiate'],
				roboto: '\' Roboto\', sans-serif;',
				segoe: ['-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";']
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
				xs: '380px',
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
			'wide': '1fr 950px 1fr',
			'extra-wide': '.2fr 4fr .2fr',
			'annoying': 'repeat( auto-fit, 192px)',
		},
		keyframes: {
			bump: {
				'0%': {
					transform: 'translate(0, 0)'
				},
				'50%': {
					transform: 'translate(0, -.1rem)  scale(1.10)'
				},

				'100%': {
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
			'spin': 'spin 1s linear infinite'
		}
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
