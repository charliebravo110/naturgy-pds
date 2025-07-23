import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
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
  submenuTab: {
    color: '#004571',
    fontWeight: 400,
    fontSize: '0.8125rem',
    marginRight: '32px',
    textTransform: 'none',
    textAlign: 'center',
    alignSelf: 'center',
    cursor: 'pointer',
    position: 'relative'
  },
  submenuTabMobile: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    color: '#004571',
    fontSize: '0.875rem',
    height: 25,
    letterSpacing: '0.02857em',
    opacity: 0.8
  },
  mobileSubmenuTabSelector: {
    marginTop: 10,
    maxWidth: 264
  },
  submenu: {
    width: '190px',
    zIndex: 1,
    top: '150px',
    backgroundColor: 'white',
    position: 'absolute',
    boxShadow: '0px 0px 5px 0px grey'
  },
  tabPadding: {
    padding: '6px 10px'
  },
  submenuInnerTab: {
    color: '#004571',
    width: '100%',
    fontWeight: 400,
    fontSize: '0.8125rem',
    textTransform: 'none',
    alignSelf: 'center',
    cursor: 'pointer',
    borderBottom: '0.5px solid grey',
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
  }
}))

export default useStyles
