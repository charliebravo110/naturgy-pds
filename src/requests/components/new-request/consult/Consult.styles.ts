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
  goBackContainer: {
    position: 'absolute',
    top: 55,
    color: '#6AA1D8',
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: {
      top: 20,
      '&.onDossier': {
        top: -10
      },
      '&.onSupply': {
        top: 100
      }
    }
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
    marginTop: 26,
    '&.without-margin': {
      marginTop: 0
    },
    [theme.breakpoints.only('xs')]: {
      '&.onSupply': {
        marginBottom: '50px'
      }
    }
  },
  description: {
    color: '#004571',
    fontWeight: 'bold',
    marginBottom: 24
  },
  items: {
    justifyContent: 'center',
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
    },
    '& span': {
      color: '#6AA1D8',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  note: {
    marginBottom: '30px',
    color: '#004571',
  },
  form: {
    width: 800,
    margin: '64px auto 0',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  requiredFields: {
    textAlign: 'center',
    marginTop: 42,
  },
  help: {
    color: '#868686',
    fontSize: 14,
    marginTop: 25
  },
  buttons: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

}))

export default useStyles