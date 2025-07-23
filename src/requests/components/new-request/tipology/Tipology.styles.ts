import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 126,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    },
    '&.without-margin': {
      marginTop: -46
    },
    '&.with-margin': {
      marginTop: 126
    }
  },
  container: {
    padding: '20px 0',
    justifyContent: 'center'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginTop: 26,
    '&.without-margin': {
      marginTop: 0
    }
  },
  description: {
    color: '#E97000',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 24
  },
  items: {
    marginTop: '42px !important',
    [theme.breakpoints.up('md')]: {
      margin: '-8px -8px -8px 0'
    }
  },
  exit: {
    textAlign: 'center',
    marginTop: 42,
    '& a': {
      color: '#6AA1D8'
    }
  }
}))

export default useStyles
