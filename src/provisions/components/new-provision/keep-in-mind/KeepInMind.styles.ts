import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 128,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    }
  },
  container: {
    padding: '20px 0 46px',
    justifyContent: 'center'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    fontSize: 36,
    color: '#004571',
    textAlign: 'center',
    margin: '26px 0 36px'
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E97000',
    textAlign: 'center',
    marginBottom: 26
  },
  text: {
    fontSize: 16,
    color: '#838383',
    textAlign: 'center',
    marginBottom: 40
  },
  step: {
    fontSize: 16,
    marginBottom: '25px',
    color: '#004571'
  },
  items: {
    [theme.breakpoints.up('lg')]: {
      width: 1052,
      margin: '0 auto'
    }
  },
  item: {
    width: 152,
    boxSizing: 'border-box',
    backgroundColor: '#F2F1EF',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
    borderRadius: 10,
    margin: '0 10px',
    // margin: '0 24px',
    '& img': {
      height: 94
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 14
    }
  },
  buttons: {
    justifyContent: 'center',
    marginTop: 32,
    '& button': {
      margin: '0 16px',
      [theme.breakpoints.only('xs')]: {
        '&:first-child': {
          marginBottom: 16
        }
      }
    }
  },
  root: {
    width: '98%',
    '& .MuiStepper-alternativeLabel': {
      width: '100%',
      boxSizing: 'border-box'
    },
    '& .MuiStepIcon-active, & .MuiStepIcon-root': {
      color: '#F2F1EF',
      border: 'solid 1px #D8D8D8',
      borderRadius: '50%'
    },
    '& .MuiStepLabel-active, & .MuiStepLabel-label': {
      color: '#004571'
    },
    '& .MuiStepIcon-text':{
      fill: '#004571'
    },
    '& .MuiPaper-root': {
      backgroundColor: 'transparent'
    },
    '& .MuiStepConnector-root': {
      left: 'calc(-50%)',
      right: 'calc(50%)',
      zIndex: -1
    },
    '& .MuiStepConnector-line': {
      borderColor: '#D8D8D8'
    }
  },
  legalDeadlines: {
    color: '#004571',
    margin: '10px 0',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    },
  },
  stepper: {
    [theme.breakpoints.up('lg')]: {
      width: 1052,
      margin: '0 auto'
    }
  }
}))

export default useStyles
