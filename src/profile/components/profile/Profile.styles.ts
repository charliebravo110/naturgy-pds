import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 126
  },
  headerTitle: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    margin: '26px 0 30px'
  },
  profileBlock: {
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    boxShadow: '0px 0px 3px 1px rgba(207, 205, 207, 1)'
  },
  blockLeft: {
    backgroundColor: '#F8F7F5',
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
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E57200'
  },
  title: {
    fontSize: 32,
    color: 'rgba(0, 69, 113, 1)',
    [theme.breakpoints.up('sm')] : {
      marginLeft: 8
    }
  },
  info: {
    paddingLeft: 4,
    color: '#838383'
  },
  label: {
    color: 'rgba(0, 69, 113, 1)',
    fontWeight: 'bold'
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
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      marginLeft: -32
    }
  },
  deleteAccount: {
    display: 'flex',
    color: '#6B97C1',
    fontWeight: 'bold',
    fontSize: 14,
    [theme.breakpoints.down('md')]: {
      marginRight: 16
    },
    [theme.breakpoints.only('xs')]: {
      marginBottom: 8
    }
  },
  deleteIcon: {
    width: 16,
    height: '100%',
    marginRight: 6
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  data: {
    marginTop: 16,
    [theme.breakpoints.up('sm')]: {
      padding: '40px 0 24px 56px',
      marginLeft: 8
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 16px'
    }
  },
  divider: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.only('xs')]: {
      display: 'block',
      width: '100%',
      height: 1
    }
  },
  dataRow: {
    marginBottom: 32
  },
  dataLastRow: {
    marginBottom: 20
  },
  password: {
    color: 'rgb(82, 86, 89)',
    marginTop: -20,
    zIndex: -1
  },
  ieFlexHack: {
    '& div': {
      flexBasis: 'auto'
    }
  },
  email: {
    wordBreak: 'break-all'
  }
}))

export default useStyles
