import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 126
  },
  maxWidthForBigScreens: {
    maxWidth: 1200
  },
  headerTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontSize: '36px',
    color: 'rgba(0, 69, 113, 1.0)',
    textAlign: 'center',
    margin: '26px 30px'
  },
  return: {
    color: '#1674D1'
  },
  profileBlock: {
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    boxShadow: '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    margin: '2% 0',
    position: 'relative'
  },
  blockLeft: {
    backgroundColor: '#F8F7F5',
    minHeight: 70,
    [theme.breakpoints.up('md')]: {
      padding: '64px 32px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: 16
    }
  },
  blockRight: {
    justifyContent: 'space-between',
    padding: '40px 0 16px',
    [theme.breakpoints.only('xs')] : {
      paddingTop: 32,
    }
  },
  avatar: {
    color: '#A3AC00',
    width: 72,
    height: 72,
    zIndex: 1,
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      marginLeft: 8
    },
    [theme.breakpoints.only('xs')]: {
      paddingBottom: 64
    }
  },
  avatarContainer: {
    position: 'absolute',
    top: 15,
    [theme.breakpoints.up('md')]: {
      top: 40,
      marginLeft: -32
    }
  },
  label: {
    margin: '20px 12px 5px 0',
    color: 'rgba(0, 69, 113, 1)'
  },
  input: {
    width: '100%',
    paddingRight: 20
  },
  allFields: {
    color: '#838383',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center'
  },
  button: {
    marginBottom: 15
  },
  cancelButton: {
    textDecoration: 'none',
    background: 'white',
    color: '#004571'
  },
  inactive: {
    pointerEvents: 'none',
    userSelect: 'none'
  },
  advice: {
    background: '#F1F5F8',
    borderRadius: 10,
    marginTop: 30,
    padding: '10px 10px 15px',
    color: '#004571',
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 35,
      height: 30,
      margin: '10px 20px 10px 10px',
      [theme.breakpoints.up('md')]: {
        width: 40,
        height: 35,
        margin: '0 10px 0 0'
      }
    },
    '& p': {
      margin: 0
    }
  }
}))

export default useStyles
