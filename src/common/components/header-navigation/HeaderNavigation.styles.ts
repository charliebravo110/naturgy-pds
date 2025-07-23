import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  tabSelector: {
    '& div[role="tablist"]': {
      justifyContent: 'flex-end !important'
    },
    '& .MuiTabs-flexContainer': {
      height: '100%'
    }
  },
  tabs: {
    height: '100%',
    borderBottom: 0,
    marginRight: -20
  },
  tabsMobile: {
    height: '100%',
    borderBottom: 0,
    display: 'inline',
    zIndex: 1,
    '& > div':{
      boxShadow: '-2px -2px 2px -1px rgba(0,0,0,0.6)',
      width: '225px',
      backgroundColor: '#FFF',
      position: 'relative',
      top: -20,
      zIndex: 1
    }
  },
  tab: {
    width: 'auto',
    minWidth: 'auto',
    height: '100%',
    padding: 0,
    overflow: 'visible',
    marginRight: 0,
    '&:last-child': {
      marginRight: 0
    },
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
    '& a': {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      color: '#155279',
      textDecoration: 'none'
    },
    '& .MuiTab-wrapper': {
      display: 'flex',
      position: 'relative',
      top: 0,
      left: 0,
      height: '100%',
      padding: '0 20px'
    }
  },
  tabMfa: {
    width: 'auto',
    minWidth: 'auto',
    height: '100%',
    padding: 0,
    overflow: 'visible',
    marginRight: 0,
    '&:last-child': {
      marginRight: 0
    },
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
    '& a': {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      color: '#155279',
      textDecoration: 'none'
    },
    '& .MuiTab-wrapper': {
      display: 'flex',
      position: 'relative',
      top: 0,
      left: 0,
      height: '100%',
      padding: '0 20px',
      '@media (max-width:1800px)': {
        fontSize: '1rem',
      },
      '@media (max-width:1600px)': {
        fontSize: '0.7rem',
      },
      '@media (max-width:1500px)': {
        fontSize: '0.65rem',
      },
      '@media (max-width:1400px)': {
        fontSize: '0.5rem',
      }
    }
  },
  tabMobile: {
    width: 'auto',
    padding: 0,
    paddingLeft: 25,
    marginRight: 0,
    backgroundColor: '#FFF',
    borderBottom: '1px solid #3f51b5',
    fontWeight: 'bold',
    textAlign: 'left',
    '& a': {
      width: '100%',
      color: '#155279',
      textDecoration: 'none',
      padding: '26px 0',
      textAlign: 'left'
    },
    '& img': {
      position: 'absolute',
      right: 15,
      height: 15
    },
    '& span': {
      alignItems: 'flex-start'
    }
  },
  badge: {

  },
  customBadge: {
    right: -12,
    backgroundColor: '#CF0E11',
    color: '#FFF',
    fontSize: 11
  }
}))

export default useStyles
