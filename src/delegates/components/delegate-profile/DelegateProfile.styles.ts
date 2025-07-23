import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 126
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
    padding: '40px 0',
    [theme.breakpoints.only('xs')] : {
      paddingTop: 32,
    }
  },
  avatar: {
    color: '#A3AC00',
    width: 72,
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
  dataRow: {
    marginBottom: 40
  },
  info: {
    paddingLeft: 4,
    marginBottom: 45,
    color: '#838383'
  },
  updateInput: {
    marginBottom: 35,
    '& input': {
      padding: 10
    }
  },
  label: {
    color: 'rgba(0, 69, 113, 1)',
    fontWeight: 'bold',
    marginBottom: 5
  },
  removeText: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#1674D1',
    marginBottom: 50,
    padding: '0 30px',
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      marginBottom: 100,
      padding: '0 50px'
    }
  },
  removeIcon: {
    transform: 'rotate(45deg)',
    marginRight: '5px'
  },
  ieFlexHack: {
    '& div': {
      flexBasis: 'auto'
    }
  }
}))

export default useStyles
