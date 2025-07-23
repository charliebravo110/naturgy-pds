import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: 20,
      paddingLeft: 20
    },
    position: 'relative'
  },
  containerNonPayment: {
    [theme.breakpoints.up('sm')]: {
      height: 150,
      marginTop: 20
    },
    [theme.breakpoints.only('xs')]: {
      paddingTop: 300,
      paddingLeft: 20
    },
    backgroundColor: '#E5ECF0'
  },
  navigation: {
    display: 'flex',
    alignItems: 'flex-end',
    position: 'relative'
  },
  tabs: {
    borderBottom: 0,
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      paddingRight: 25
    },
  },
  tab: {
    marginRight: 250,
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
    '&:last-child': {
      marginRight: 0
    },
    whiteSpace: 'unset'
  },
  mobileTab: {
    width: '100%',
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
    '&.selectedOutter': {
      borderBottom: '4px solid #f09b4d',
      borderRadius: 3.2
    },
    '&.selectedInner': {
      fontWeight: 'bold'
    }
  },
  mobileMenuTab: {
    marginLeft: 20
  },
  badge: {
    paddingRight: '16px'
  },
  customBadge: {
    backgroundColor: '#CF0E11',
    color: '#FFF'
  },
  submenuTab: {
    color: '#004571',
    fontWeight: 400,
    fontSize: '0.8125rem',
    marginRight: '30px',
    textTransform: 'none',
    textAlign: 'center',
    alignSelf: 'center',
    cursor: 'pointer',
    position: 'relative'
  },
  submenuTabMobile: {
    alignItems: 'center',
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    color: '#004571',
    fontSize: '0.875rem',
    height: 25,
    letterSpacing: '0.02857em',
    opacity: 0.8,
    paddingBottom: 4
  },
  mobileSubmenuTabSelector: {
    marginTop: 10,
    maxWidth: 264
  },
  customTab: {
    width: 190,
    padding: '6px 10px',
    cursor: 'pointer'
  },
  submenu: {
    width: 190,
    zIndex: 1,
    top: 150,
    backgroundColor: 'white',
    position: 'absolute',
    boxShadow: '0px 0px 5px 0px grey',
    left: 'calc(50% - 95px)'
  },
  submenuInnerTab: {
    color: '#004571',
    width: '100%',
    fontWeight: 400,
    fontSize: '0.8125rem',
    textTransform: 'none',
    alignSelf: 'center',
    cursor: 'pointer',
    padding: 14.7,
    '&:hover': {
      opacity: 0.8
    },
    '&.selected': {
      fontWeight: 'bold'
    },
    '&.disabled': {
      filter: 'grayscale(80%)'
    }
  },
  submenuInnerTabLast: {
    borderBottom: 0
  },
  menuArrow: {
    position: 'absolute',
    right: '-30px',
    transition: 'all 600ms'
  },
  menuArrowMobile: {
    marginLeft: 20,
    transition: 'all 600ms'
  },
  menuArrowOpen: {
    '-ms-transform': 'rotate(180deg)',
    transform: 'rotate(180deg)'
  },
  menuArrowOpenMobile: {
    marginBottom: 8,
    '-ms-transform': 'rotate(180deg)',
    transform: 'rotate(180deg)'
  }
}))

export default useStyles
