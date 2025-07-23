import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  header: {
	backgroundColor: '#FFF',
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)',
    transition: 'top 0.2s ease-out 0s',
    '&.contracted.logged': {
      top: -55
    },
    '&.contracted .innerBar': {
      height: 60
    },
    '&.contracted .innerBar .logo img': {
      width: 64
    }
  },
  bar: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerBar: {
    height: 75,
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'height 0.2s ease-out 0s'
  },
  innerBarSm: {
    height: 75,
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'height 0.2s ease-out 0s',
    maxWidth: 1200
  },
  container: {
    height: '100%',
    margin: '0 auto'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    display: 'block',
    fontSize: 0,
    '& img': {
      width: 80,
      transition: 'width 0.2s ease-out 0s',
      [theme.breakpoints.down('sm')]: {
        marginLeft: 14
      }
    }
  },
  rightContainer: {
    display: 'flex',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative'
  },
  headerLinksWrapper: {
    display: 'flex',
    padding: '0 10px'
  },
  headerLink: {
    height: '100%',
    padding: '0 15px',
    textDecoration: 'none',
    fontFamily: 'Arial, Helvetica, Arial, serif',
    color: 'rgba(0, 69, 113, 1.0)',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  headerLinkDecoration: {
    height: '4px',
    width: '100%',
    borderRadius: '2px',
    background: 'orange',
    position: 'absolute',
    bottom: '0',
    left: '0'
  },
  menuOpen: {
    cursor: 'pointer',
    boxShadow: '-2px -2px 2px -1px rgba(0,0,0,0.6)',
    margin: '18px 20px',
    zIndex: 9999,
    position: 'relative',
    backgroundColor: '#FFF',
    width: 60,
    height: 60,
    left: 150
  },
  menuClosed: {
    cursor: 'pointer',
    margin: '20px 0',
    position: 'relative',
    backgroundColor: '#FFF',
    width: 50,
    height: 50
  },
  closeIcon: {
    padding: '13px 0 0 13px',
    width: 30,
    height: 30
  },
  menuIcon: {
    position: 'absolute',
    marginTop: 15,
    right: '0.9375rem',
    boxShadow: '0 -2px 0px 3px #004571, 0 9px 0 3px #004571, 0px 20px 0 3px #004571',
    width: 25
  },
  rightContentMobile: {
    position: 'absolute',
    right: 0,
    top: -5
  },
  navigationWrapper: {
    height: '100%'
  },
  dialog: {
		'& .MuiPaper-root.MuiDialog-paper': {
			width: 780,
			border: '2px solid rgb(61, 114, 147)'
		},
		'& .MuiDialogContent-root': {
			minHeight: 160,
			padding: 36,
			overflow: 'hidden'
		}
	},
  closeButton: {
		position: 'absolute',
		top: 18,
		right: 18,
		cursor: 'pointer'
	},
  title: {
		color: '#004571',
		fontSize: 26,
		marginBottom: 24,
		marginTop: 10,
	},
	body : {
		color: '#696969'
	},
  button: {
		marginTop: 24
	},
  lastPasswordContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}))

export default useStyles
