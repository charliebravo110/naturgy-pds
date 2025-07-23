import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 73,
    '&.logged': {
      marginTop: 140
    }
  },
  headerTitle: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginTop: 26,
    marginBottom: 46
  },
  profileBlock: {
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    boxShadow: '0px 0px 3px 1px rgba(207, 205, 207, 1)'
  },
  profileBlockLeft: {
    backgroundColor: '#F8F7F5',
    [theme.breakpoints.up('md')]: {
      paddingTop: 64,
      paddingLeft: 32
    },
    [theme.breakpoints.down('sm')]: {
      padding: 32
    }
  },
  profileBlockRight: {
    paddingBottom: 16,
    [theme.breakpoints.only('xs')] : {
      paddingTop: 32,
    },
    [theme.breakpoints.up('sm')] : {
      paddingTop: 64,
    }
  },
  avatar: {
    color: '#E77202',
    width: 72,
    zIndex: 1,
    position: 'relative'
  },
  avatarContainer: {
    marginRight: 24,
    position: 'relative',
    [theme.breakpoints.up('md')] : {
      marginLeft: -36
    },
    [theme.breakpoints.down('sm')] : {
      marginLeft: 16
    },
  },
  titleContainer: {
    [theme.breakpoints.up('md')] : {
      paddingTop: 12
    },
    [theme.breakpoints.down('sm')] : {
      marginLeft: 24
    }
  },
  title: {
    fontSize: 32,
    color: 'rgba(0, 69, 113, 1)'
  },
  successMessageBody: {
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 80,
    fontSize: 25,
    color: 'rgba(0, 69, 113, 1)',
    [theme.breakpoints.only('xs')] : {
      paddingLeft: 24,
      paddingRight: 24
    }
  },
  okIcon: {
    fontSize: 72,
    marginBottom: 16
  },
  button: {
    margin: 32
  }
}))

export default useStyles
