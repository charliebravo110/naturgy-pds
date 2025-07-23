import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center'
  },
  title: {
    color: '#004571',
    fontSize: 36,
    margin: '26px 0 46px',
    textAlign: 'center'
  },
  block: {
    padding: '20px 20px',
    border: '1px solid #E3EBEF',
    textAlign: 'center',
    [theme.breakpoints.down('sm')] : {
      padding: '10px 10px'
    }
  },
  info: {
    color: '#2C648A'
  },
  paymentTitle: {
    color: '#2C648A',
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: '10px'
  },
  payment: {
    color: '#E57000',
    fontWeight: 'bold',
    fontSize: 50
  },
  iva: {
    color: '#2C648A',
    fontWeight: 'bold'
  },
  separator: {
    width: '90%',
    alignSelf: 'center',
    height: '1px',
    backgroundColor: '#E3EBEF',
    margin: '20px 0'
  },
  paymentSubtitle: {
    color: '#B0B0B0',
    alignSelf: 'center'
  },
  error: {
    color: '#F15B70',
    fontWeight: 'bold',
    marginTop: 30
  },
  buttons: {},
  button: {
    margin: 10
  },
  forms: {
    margin: '40px 0'
  },
  completedTitle: {
    color: '#004571',
    fontSize: 24,
    margin: '26px 0 14px',
    textAlign: 'center'
  },
  completedDescription: {
    color: '#E97000',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  question: {
    color: '#004571',
    fontWeight: 'bold',
    fontSize: '15px'
  },
  questions: {
    marginTop: 30
  },
  subtitle: {
    color: '#004571',
    marginBottom: 7,
    textAlign: 'left'
  },
  label: {
    textAlign: 'left',
    marginBottom: 7,
    color: '#004571',
    fontSize: '14px'
  },
  questionForm: {
    marginTop: 7,
    padding: '0% 15%'
  },
  input: {
    color: '#868686',
    marginBottom: 12,
    '& .MuiSelect-root': {
      color: '#868686'
    }
  }, functionDisabled: {
    backgroundColor: '#F2F5F8',
    marginBottom: 20,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
  },
  functionDisabledTitle: {
    fontWeight: 'bold',
    color: '#256094',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  iframe: {
    width: '100%',
    height: 54,
    border: 0,
    [theme.breakpoints.down('lg')]: {
      width: '100%'
    }
  },
  iframeExt: {
    width: '100%',
    height: 700,
    border: 0,
    [theme.breakpoints.down('lg')]: {
      width: '100%'
    }
  },
  link: {
    textDecoration: 'underline', 
    color: '#0c69c6',
    margin:'0px',
  },
  policy: {
    color: '#605e5e',
  },
  tabIcon: {
		filter: 'invert(57%) sepia(68%) saturate(3779%) hue-rotate(189deg) brightness(91%) contrast(84%)',
    width: '5%',
    position: 'relative',
    left: '5px',
    top: '5px'
  }
}))

export default useStyles
