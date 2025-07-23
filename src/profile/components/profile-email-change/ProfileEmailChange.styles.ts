import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 140
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
    backgroundColor: '#f8f7f5',
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
    }
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
    color: 'rgba(0, 69, 113, 1.0)'
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#525659',
    [theme.breakpoints.only('xs')] : {
      marginTop: 12,
      marginLeft: -80
    }
  },
  data: {
    [theme.breakpoints.up('sm')]: {
      paddingTop: 40,
      paddingBottom: 24
    }
  },
  inputs: {
    [theme.breakpoints.up('md')] : {
      paddingLeft: 56,
      paddingRight: 56,
      paddingTop: 80
    },
    [theme.breakpoints.down('sm')] : {
      paddingTop: 56,
      paddingLeft: 16,
      paddingRight: 16
    }
  },
  label: {
    marginRight: 12,
    color: 'rgba(0, 69, 113, 1.0)'
  },
  required: {
    fontSize: 16,
    color: '#525659'
  },
  textField: {
    marginTop: 8,
    marginBottom: 8
  },
  buttons: {
    [theme.breakpoints.only('xs')] : {
      marginTop: 32
    },
    [theme.breakpoints.up('sm')] : {
      marginTop: 96
    }
  },
  button: {
    margin: 16,
    [theme.breakpoints.only('xs')] : {
      width: '100%'
    }
  }
}))

export default useStyles
