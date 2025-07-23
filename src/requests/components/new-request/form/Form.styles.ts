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
  buttons: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  exit: {
    '& a': {
      color: '#6AA1D8'
    },
    '& span': {
      color: '#6AA1D8',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  label: {
    color: '#004571',
    fontSize: 14,
    marginBottom: 8
  },
  fieldWithoutLabel: {
    marginTop: 19
  },
  fieldTimeZone:{
    marginLeft: '15%'
  },
  timeContainer:{
    marginTop: 20,
    marginBottom: 20
  },
  leyend:{
    color: '#004571',
    marginBottom: 20
  },
  items: {
    minHeight: 110,
    justifyContent: 'center'
  },
  help: {
    color: '#868686',
    fontSize: 14,
    marginTop: 4
  },
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 700,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      padding: 48
    }
  },
  dialogContainer: {
    position: 'relative',
    padding: 36
  },
  noItems: {
    textAlign: 'center',
    justifyContent: 'center',
    '& .row': {
      display: 'block',
      textAlign: 'center',
      marginTop: 24
    },
    '& .title': {
      color: '#004571',
      fontSize: 18
    },
    '& .description': {
      color: '#777'
    },
    '& .buttons': {
      justifyContent: 'center',
      marginTop: 36
    }
  },
  alertIcon: {
    height: '100%'
  },
  alertBlock: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  text: {
    //textAlign: 'center',
    //justifyContent: 'center',
    marginTop: 10,
    color: '#004571'
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  description: {
    color: '#004571',
    fontWeight: 'bold',
    marginBottom: 24
  },
  readingsContainer: {
    marginBottom: 15
  },
  readingInput: {
    width: '100px',
    float: 'left',
    '& .MuiInputBase-input': {
      height: '10px'
    } 
  },
  readingLabel: {
    float: 'left',
    color: '#004571',
    fontSize: 14,
    paddingRight: '10px'
  },
  unitLabel: {
    float: 'left',
    color: '#004571',
    fontSize: 14,
    paddingLeft: '10px'
  },
  readingPeriod: {
    marginBottom: '10px'
  }
}))

export default useStyles
