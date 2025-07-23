import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  generalCont: {
		paddingTop: '0px',
    position: 'absolute',
    right: '0',
    backgroundColor:'#004571',
    width: '100px',
    height: '100px',
    alignItems: 'center',
    justifyContent: 'top',
    borderRadius: '50%',
    borderTopRightRadius: '0',
    color: '#ffffff',
    overflow: 'hidden',
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: { 
      width: '50px',
      height: '50px'
    }
  },
	generalContSpaced: {
		paddingTop: '0px',
    position: 'absolute',
    right: '0',
		top: '210px',
    backgroundColor:'#004571',
    width: '100px',
    height: '100px',
    alignItems: 'center',
    justifyContent: 'top',
    borderRadius: '50%',
    borderTopRightRadius: '0',
    color: '#ffffff',
    overflow: 'hidden',
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: { 
      width: '50px',
      height: '50px'
    }
  },
	generalMobileContSpaced: {
		paddingTop: '0px',
    position: 'absolute',
    right: '0',
		top: '125px',
    backgroundColor:'#004571',
    width: '100px',
    height: '100px',
    alignItems: 'center',
    justifyContent: 'top',
    borderRadius: '50%',
    borderTopRightRadius: '0',
    color: '#ffffff',
    overflow: 'hidden',
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: { 
      width: '50px',
      height: '50px'
    }
  },
	iconCont: {
		height: '40%'
  },
	textBlock: {
		height: '60%'
	},
	icon: {
		paddingTop: '15%',
    height: '85%',
    filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(57deg) brightness(103%) contrast(103%)'
  },
	tabCont: {
		position: 'absolute',
		height: '20%',
		weight: '100%',
		top: '0px',
		right: '0px'
  },
	tabIcon: {
		position: 'absolute',
		height: '100%',
		top: '2px',
		right: '2px',
    filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(57deg) brightness(103%) contrast(103%)'
  },
	text: {},
	iconMobileCont: {
		display: 'flex',
		alignItems: 'center',
    justifyContent: 'center',
		textAlign: 'center',
		width: '100%',
		height: '100%'
  },
	iconMobileTabCont: {
		position: 'absolute',
		top: '0px',
		right: '0px',
		width: '100%',
		height: '25%'
  },
	mobileIcon: {
    height: '67.5%',
    filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(57deg) brightness(103%) contrast(103%)',
  },
	mobileTabIcon: {
		position: 'absolute',
    height: '100%',
		right: '1.5px',
		top: '0px',
    filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(57deg) brightness(103%) contrast(103%)',
  }
}))

export default useStyles
