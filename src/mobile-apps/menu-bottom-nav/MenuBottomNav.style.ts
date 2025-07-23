import { makeStyles } from '@material-ui/core/styles'
import { COLOR_CLIENT_NAVY, COLOR_CLIENT_ORANGE } from '../common/configAndConstants'

// the design received from the designer (80px) has a much larger height than mui default (56px)
const navBarHeight = '75px'

const useStyles = makeStyles((theme) => ({
  spacerUnderFooter: {
    // add a spacer to avoid part of the footer to be hidden by the bottom nav
    height: navBarHeight,
    minHeight: `${navBarHeight} !important`, // avoids the height to be 0 on iOS
  },
  bottomNav: {
    // always visible on the bottom of the screen
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: navBarHeight,
    zIndex: 901, //spinner overlay is 1000, so this should be lower

    // highlight selected item
    '& > .Mui-selected': {
      // icon color
      '& > span  svg > path': {
        fill: COLOR_CLIENT_ORANGE,
      },
      // underline addition (with pseudo element)
      '& > span:first-child::after': {
        display: 'block',
        clear: 'both',
        content: '""',
        position: 'relative',
        left: 0,
        bottom: 0,
        width: '20px',
        height: '3px',
        borderBottom: `medium solid ${COLOR_CLIENT_ORANGE}`,
        margin: '0 auto',
      },
    },

    // all labels are the same color and size (selected or not)
    '& > a > span > span': {
      color: COLOR_CLIENT_NAVY,
      fontSize: '0.75rem !important',
    },

    '& .MuiBottomNavigationAction-root': {
      // remove the weird MUI min-width 80px to avoid the 4 items not fitting on small screens
      minWidth: 'unset',
    },

    // shadow between the bottom nav and the content
    filter: 'drop-shadow(0px 0px 10px rgba(85, 85, 85, 0.2))',
  },
}))

export default useStyles
