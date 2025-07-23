import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  userCard: {
    position: 'relative',
    //padding: '20px',
    marginTop: '20px',
    marginBottom: '20px',
    border: '2px solid rgb(220, 220, 220)',
    borderRadius: '5px',
    [theme.breakpoints.up('sm')]: {
      marginTop: '40px'
    }
  },
  userIcon: {
    marginRight: '10px'
  },
  row: {
    margin: '10px 0',
    [theme.breakpoints.up('sm')]: {
    margin: '20px 0',
    wordBreak: 'break-word'
    }
  },
  blue: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1.0)'
  },
  blueNotBold: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    color: 'rgba(0, 69, 113, 1.0)'
  },
  alert: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, .85)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 1,
    '& img': {
      marginBottom: 16
    },
    '& div': {
      color: '#004571'
    }
  },

  alertRelative: {
    display: 'flex',
    position: 'relative',
    marginTop:'20px',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, .85)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 1,
    '& img': {
      marginBottom: 16
    },
    '& div': {
      color: '#004571'
    }
  },
  notRegistered: {
    marginLeft: 10,
    backgroundColor: 'red',
    color: 'white',
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomRightRadius:'5px',
    borderBottomLeftRadius:'5px',
  },

  userCancel:{
    marginLeft: 10,
    backgroundColor: 'orange',
    color: 'white',
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomRightRadius:'5px',
    borderBottomLeftRadius:'5px',
  },
  
  registeredPDS:{
    marginLeft: 10,
    backgroundColor: 'green',
    color: 'white',
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomRightRadius:'5px',
    borderBottomLeftRadius:'5px',
  },

  position:{
    position:'absolute',
    right:'11px'
  }
}))

export default useStyles
