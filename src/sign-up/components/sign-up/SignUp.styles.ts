import { makeStyles } from '@material-ui/core/styles'

import Background from './../../../assets/img/background-manos-teclado-oscuro.png'

const useStyles = makeStyles((theme) => ({
  block: {
    backgroundColor: '#185276',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 75
  },

  displayNone:{
    display:'none'
  }, 
  errorAlertNew: {
    width: '85%',
    backgroundColor: '#E1EDF0',
    color: '#256094',
    alignItems: 'center',
    padding: '12px 18px',
    borderRadius: 4,
    margin: '0 auto',
    '& .icon': {
      display: 'inline-block',
      width: 32,
      height: 32,
      boxSizing: 'border-box',
      textAlign: 'center',
      padding: 3,
      borderRadius: '50%',
      '& img': {
        width: 30
      }
    },
    '& .text': {
      width: '82%',
      fontSize: 14,
      textAlign: 'left',
      marginLeft: 12,
      [theme.breakpoints.down('sm')]: {
        margin: '10px'
      }
    }
  },
  icon: {
    width: 12,
    marginRight:10,
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
      marginBottom: '5px',
      marginTop: '15px',
      display: 'block'
    }
    },
    erroricon: {
      width: 12,
      transform: 'scale(1.15)',
      transformOrigin: 'center',
      marginRight:10,
      [theme.breakpoints.down('sm')]: {
        margin: '0 auto',
        marginBottom: '5px',
        marginTop: '15px',
        display: 'block'
      }
      },
    icon2: {
      width: 20,
      marginRight:10,
      [theme.breakpoints.down('sm')]: {
        margin: '0 auto',
        marginBottom: '5px',
        marginTop: '15px',
        display: 'block'
      }
      },
  	dossierDateAdviseTitle: {
      height: 110,
      padding: 5,
      fontWeight: 'bold',
      color: '#256094',
      [theme.breakpoints.only('xs')]: {
        textAlign: 'left',
        height: 50,
      }
    },
    dossierDateAdviseIcon:{
      margin: '0',
      marginRight: '.5em',
      marginTop: '4px',
    },
    dossierDateAdviseItem: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems:'flex-start',
      margin: '4px 0'
    },
    dossierDateAdviseBlue: {
      color: '#256094',
      [theme.breakpoints.only('xs')]: {
        textAlign: 'left'
      }
    },

    dossierDateAdviseRed: {
      color: 'red',
      [theme.breakpoints.only('xs')]: {
        textAlign: 'left'
      }
      
    },
    
  subtitle: {
    color: '#868686',
  },
  check: {
     color: '#004571'
  },
  cuadroCheck:{
    marginLeft:10
  },

  dossierDateAdviseContainer: {
    backgroundColor: '#F2F5F8',
    marginBottom: 46,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
    },
    dossierDateAdviseBox: {
      // margin: '0 auto',
      // maxWidth: 1000,
      marginTop: 6,
      marginBottom: 6,
      marginInline: '4%'
    },
    dossierDateAdviseBoxMargin: {
      // margin: '0 auto',
      // maxWidth: 1000,
      marginTop: 30,
      marginBottom: 6,  
      marginInline: '4%'
    },
    dossierCheckBox: {
      margin: '0 auto',
      maxWidth: 1100,
      marginTop: 6,
      marginLeft:0,
      marginBottom: 6
  
      },
    dossierDateAdviseBoxFinal: {
      margin: '0 auto',
      maxWidth: 1000,
      marginTop: 6,
      marginBottom: 30
  
      },
  container: {
    padding: '20px 0',
    backgroundSize: '100% 100%',
    flexGrow: 1,
    backgroundImage: `url(${Background})`
  },
  register: {
    padding: '28px 30px 44px',
    backgroundColor: 'white',
    maxWidth: 1200
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 26,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center'
  },
  privateAccess: {
    fontSize: 12,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginTop: 15
    }
  },
  registerContainer: {
    alignItems: 'start',
    margin: '10px 0'
  },
  mandatoryFields: {
    fontSize: 12,
    marginBottom: 10
  },
  textField: {
    margin: 16,
    width: '85%',
    
  },
  textField2: {
    margin: 16,
    width: '85%',
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  passwordStrengthMeter: {
    width: '85%'
  },
  privacyPolicyLink: {
    color: '#0066CC',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  button: {
    margin: '32px 32px 0'
  },
  tooltipContainer: {
    position: 'relative',
    marginTop: 20
  },
  marginTop20:{
    marginTop: 20
  },
  tooltip: {
    position: 'absolute',
    top: 36,
    right: 4
  },
  rightContent: {
    marginTop: 15
  },
  privacyPolicy: {
    marginTop: 30,
    '& .MuiFormControlLabel-root': {
      marginLeft: 0
    }
  },
  privacyPolicyLabel: {
    marginLeft: 8
  },
  tab: {
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
  },
  advise: {
    marginTop: 5
  }
}))

export default useStyles
