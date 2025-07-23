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
    position: 'relative',
    padding: '20px 0',
    justifyContent: 'center'
  },
  goBack: {
    alignItems: 'center'
  },
  goBackIcon: {
    height: 24
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    margin: '26px 0 42px',
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
    justifyContent: 'center',
    marginTop: '42px !important',
    [theme.breakpoints.up('md')]: {
      margin: '-8px -8px -8px 0'
    }
  },
  details: {
    textAlign: 'center',
    color: '#004571',
    fontWeight: 'bold'
  },
  textInfo: {
    textAlign: 'center',
    color: '#004571',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 24
  },
  textInfoLittle: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 20,
    '&.custom': {
      lineHeight: 1.5
    }
  },
  reference: {
    display: 'inline-block',
    position: 'relative',
    backgroundColor: '#009AA6',
    color: '#FFF',
    fontWeight: 'bold',
    padding: '10px 32px',
    borderRadius: '20em',
    marginTop: 24,
    [theme.breakpoints.down('sm')]: {
      padding: '10px 54px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '10px 24px'
    }
  },
  buttonContainer: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginTop: 16
    },
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      flexBasis: 'auto'
    },
  },
  button: {
    padding: '3px 20px 4px',
    height: 44,
    marginTop: 42,
    '& span[class^="MuiButton-label"]': {
      fontSize: 16
    },
    [theme.breakpoints.only('xs')]: {
      paddingLeft: '20px',
      height: '44px',
      width: '50%',
      minWidth: '100%'
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
