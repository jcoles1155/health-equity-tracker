import type { Config } from 'tailwindcss'

export const standardSizes = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    screens: standardSizes,
    maxHeight: standardSizes,
    maxWidth: standardSizes,
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '30px',
      '2xl': '40px',
    },
    boxShadow: {
      raised:
        'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px',
      'raised-tighter':
        'rgba(0, 0, 0, 0.1) 0px 3px 3px -2px, rgba(0, 0, 0, 0.08) 0px 6px 7px 0px, rgba(0, 0, 0, 0.06) 0px 2px 9px 1px',

    },
    colors: {
      'alert-color': 'rgb(var(--alert-color) / <alpha-value>)',
      'alt-black': 'rgb(var(--alt-black) / <alpha-value>)',
      'alt-dark': 'rgb(var(--alt-dark)  / <alpha-value>)',
      'alt-green': 'rgb(var(--alt-green) / <alpha-value>)',
      'alt-grey': 'rgb(var(--alt-grey) / <alpha-value>)',
      'alt-orange': 'rgb(var(--alt-orange) / <alpha-value>)',
      'alt-red': 'rgb(var(--alt-red) / <alpha-value>)',
      'bar-chart-dark': 'rgb(var(--bar-chart-dark) / <alpha-value>)',
      'bar-chart-light': 'rgb(var(--bar-chart-light) / <alpha-value>)',
      'bg-color': 'rgb(var(--bg-color) / <alpha-value>)',
      'black': 'rgb(var(--black) / <alpha-value>)',
      'blue': 'rgb(var(--blue) / <alpha-value>)',
      'border-color': 'rgb(var(--border-color) / <alpha-value>)',
      'dark-blue': 'rgb(var(--dark-blue) / <alpha-value>)',
      'dark-green': 'rgb(var(--dark-green) / <alpha-value>)',
      'explore-bg-color': 'rgb(var(--explore-bg-color) / <alpha-value>)',
      'footer-color': 'rgb(var(--footer-color) / <alpha-value>)',
      'grey-dark': 'rgb(var(--grey-dark) / <alpha-value>)',
      'grey-grid-color': 'rgb(var(--grey-grid-color) / <alpha-value>)',
      'highest-lowest-color':
        'rgb(var(--highest-lowest-color) / <alpha-value>)',
      'how-to-color': 'rgb(var(--how-to-color) / <alpha-value>)',
      'infobar-color': 'rgb(var(--infobar-color) / <alpha-value>)',
      'join-effort-bg1': 'rgb(var(--join-effort-bg1) / <alpha-value>)',
      'join-effort-bg2': 'rgb(var(--join-effort-bg2) / <alpha-value>)',
      'join-effort-bg3': 'rgb(var(--join-effort-bg3) / <alpha-value>)',
      'listbox-color': 'rgb(var(--listbox-color) / <alpha-value>)',
      'map-dark': 'rgb(var(--map-dark) / <alpha-value>)',
      'map-darker': 'rgb(var(--map-darker) / <alpha-value>)',
      'map-darkest': 'rgb(var(--map-darkest) / <alpha-value>)',
      'map-light': 'rgb(var(--map-light) / <alpha-value>)',
      'map-lighter': 'rgb(var(--map-lighter) / <alpha-value>)',
      'map-lightest': 'rgb(var(--map-lightest) / <alpha-value>)',
      'map-medicare-dark': 'rgb(var(--map-medicare-dark) / <alpha-value>)',
      'map-medicare-darkest':
        'rgb(var(--map-medicare-darkest) / <alpha-value>)',
      'map-medicare-even-lighter':
        'rgb(var(--map-medicare-even-lighter) / <alpha-value>)',
      'map-medicare-light': 'rgb(var(--map-medicare-light) / <alpha-value>)',
      'map-medicare-lighter':
        'rgb(var(--map-medicare-lighter) / <alpha-value>)',
      'map-medicare-lightest':
        'rgb(var(--map-medicare-lightest) / <alpha-value>)',
      'map-medicare-mid': 'rgb(var(--map-medicare-mid) / <alpha-value>)',
      'map-medicare-min': 'rgb(var(--map-medicare-min) / <alpha-value>)',
      'map-mid': 'rgb(var(--map-mid) / <alpha-value>)',
      'map-min': 'rgb(var(--map-min) / <alpha-value>)',
      'map-women-dark': 'rgb(var(--map-women-dark) / <alpha-value>)',
      'map-women-darker': 'rgb(var(--map-women-darker) / <alpha-value>)',
      'map-women-darkest': 'rgb(var(--map-women-darkest) / <alpha-value>)',
      'map-women-light': 'rgb(var(--map-women-light) / <alpha-value>)',
      'map-women-lighter': 'rgb(var(--map-women-lighter) / <alpha-value>)',
      'map-women-lightest': 'rgb(var(--map-women-lightest) / <alpha-value>)',
      'map-women-mid': 'rgb(var(--map-women-mid) / <alpha-value>)',
      'map-women-min': 'rgb(var(--map-women-min) / <alpha-value>)',
      'navlink-color': 'rgb(var(--navlink-color) / <alpha-value>)',
      'red-orange': 'rgb(var(--red-orange) / <alpha-value>)',
      'report-alert': 'rgb(var(--report-alert) / <alpha-value>)',
      'secondary-dark': 'rgb(var(--secondary-dark) / <alpha-value>)',
      'secondary-light': 'rgb(var(--secondary-light) / <alpha-value>)',
      'secondary-main': 'rgb(var(--secondary-main) / <alpha-value>)',
      'standard-info': 'rgb(var(--standard-info) / <alpha-value>)',
      'standard-warning': 'rgb(var(--standard-warning) / <alpha-value>)',
      'team-border-color': 'rgb(var(--team-border-color) / <alpha-value>)',
      'time-cyan-blue': 'rgb(var(--time-cyan-blue) / <alpha-value>)',
      'time-dark-red': 'rgb(var(--time-dark-red) / <alpha-value>)',
      'time-pastel-green': 'rgb(var(--time-pastel-green) / <alpha-value>)',
      'time-pink': 'rgb(var(--time-pink) / <alpha-value>)',
      'time-purple': 'rgb(var(--time-purple) / <alpha-value>)',
      'time-yellow': 'rgb(var(--time-yellow) / <alpha-value>)',
      'toggle-color': 'rgb(var(--toggle-color) / <alpha-value>)',
      'unknown-map-even-more':
        'rgb(var(--unknown-map-even-more) / <alpha-value>)',
      'unknown-map-least': 'rgb(var(--unknown-map-least) / <alpha-value>)',
      'unknown-map-less': 'rgb(var(--unknown-map-less) / <alpha-value>)',
      'unknown-map-lesser': 'rgb(var(--unknown-map-lesser) / <alpha-value>)',
      'unknown-map-mid': 'rgb(var(--unknown-map-mid) / <alpha-value>)',
      'unknown-map-min': 'rgb(var(--unknown-map-min) / <alpha-value>)',
      'unknown-map-more': 'rgb(var(--unknown-map-more) / <alpha-value>)',
      'unknown-map-most': 'rgb(var(--unknown-map-most) / <alpha-value>)',
      'white': 'rgb(var(--white) / <alpha-value>) !important',
      'why-box-color': 'rgb(var(--why-box-color) / <alpha-value>)',
      'yellow': 'rgb(var(--yellow) / <alpha-value>)',
    },
    lineHeight: {
      lhSuperLoose: '2.45',
      lhLoose: '1.6',
      lhSomeMoreSpace: '1.3',
      lhSomeSpace: '1.15',
      lhNormal: '1',
      lhTight: '0.95',
      lhModalHeading: '1.25',
    },
    fontFamily: {
      sansTitle: ['DM Sans', 'sans-serif'],
      sansText: ['Inter', 'sans-serif'],
      serif: ['Taviraj', 'serif'],
      math: ['KaTeX_Math', 'mono']
    },
    fontSize: {
      smallest: '0.75rem',
      small: '0.875rem',
      text: '1rem',
      title: '1.125rem',
      exploreButton: '1.2rem',
      smallestHeader: '1.5rem',
      smallerHeader: '1.625rem',
      smallHeader: '1.75rem',
      header: '2rem',
      bigHeader: '3rem',
      biggerHeader: '3.125rem',
      biggestHeader: '4rem',
    },
    zIndex: {
      "z-bottom": 'var(--z-bottom)',
      "z-middle": 'var(--z-middle)',
      "z-almost-top": 'var(--z-almost-top)',
      "z-top": 'var(--z-top)',
    },
    extend: {
      maxHeight: {
        aimToGo: "255px",
      },
      maxWidth: {
        aimToGo: "255px",
        menu: "320px",
        articleLogo: '700px',
        teamHeadshot: '181px',
        teamLogo: '250px',
        newsPage: '1440px',
        equityLogo: '400px'
      },
      height: {
        joinEffortLogo: '720px',
      },
      width: {
        joinEffortLogo: '600px',
        '90p': '90%'
      },
      padding: {
        '1p': '1%',
        '15p': '15%',

      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
} satisfies Config