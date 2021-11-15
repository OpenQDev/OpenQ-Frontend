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
		extend: {
			boxShadow: {
				inner: 'inset 0 -2px 3px 0 rgba(0, 0, 0, 0.06)',
			},
			colors: {
				'menu-black': '#090909',
				'button-pink': '#FF006A',
				'bg-input-color': '#C45454',
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
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
