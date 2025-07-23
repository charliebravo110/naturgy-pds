import { red } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  '@keyframes onAutoFillStart': {},
  '@keyframes onAutoFillCancel': {},
  title: {
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginBottom: 12
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
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
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
    height: 40,
    margin: '20px 0px 3px',
  },
  link: {
    color: '#6ea8e2',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  linkRed: {
    color: 'Red',
    textDecoration: 'underline',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  errorAlertNew: {
    width: '74%',
    backgroundColor: '#E1EDF0',
    color: '#D12A06',
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
      fontSize: 15,
      textAlign: 'left',
      marginLeft: 12,
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        margin: '10px 0 0'
      }
    }
  },
  errorAlertNewRed: {
    width: '74%',
    backgroundColor: '#E1EDF0',
    color: 'red',
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
      fontSize: 15,
      textAlign: 'left',
      marginLeft: 12,
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        margin: '10px 0 0'
      }
    }
  },
  actionBox: {
    display: 'inline-flex',
    width: 500,
    backgroundColor: '#E1EDF0',
    color: '#164258',
    textAlign: 'left',
    padding: '8px 20px',
    borderRadius: 4
  },
  alertLabel: {
    margin: '20px 60px 0',
    color: 'red',
    alignContent: 'left',
    display:'inline'
  },
  margintop:{
    marginTop: 4,

  },
  recoverPassword: {
    marginTop: 12,
    color: 'rgba(51, 51, 51, 1)',
    textAlign: 'center'
  },
  recoverPasswordLink: {
    color: 'rgba(0, 102, 204, 1)',
    textDecoration: 'underline'
  },
  textField: {
    margin: '16px 0',
    width: '74%',
    '& input': {
      '&:-webkit-autofill': {
        animation: '$onAutoFillStart 2000ms infinite',
        transition: 'background-color 50000s ease-in-out 0s'
      },
      '&:not(:-webkit-autofill)': {
        animation: '$onAutoFillCancel 2000ms infinite'
      }
    }
  },
  errorAlert: {
    width: '74%',
    backgroundColor: '#F2F5F8',
    color: '#D3222A',
    alignItems: 'center',
    padding: '12px 18px',
    border: 'solid 1px #D3222A',
    borderRadius: 4,
    margin: '0 auto',
    '& .icon': {
      display: 'inline-block',
      width: 32,
      height: 32,
      boxSizing: 'border-box',
      backgroundColor: '#D3222A',
      textAlign: 'center',
      padding: 8,
      borderRadius: '50%',
      '& img': {
        width: 14
      }
    },
    '& .text': {
      width: '82%',
      fontSize: 12,
      textAlign: 'left',
      marginLeft: 12,
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        margin: '10px 0 0'
      }
    }
  },

  
  button: {
    marginTop: 32,
    width: '74%',
  },
  rememberUser:{
    margin: '16px 0 16px 0',
    color: 'rgba(51, 51, 51, 1)',
    display: 'inline-flex',
    alignItems: 'center', 
    width: '74%',
    textAlign: 'center',
    '& .makeStyles-uncheckedCheckbox-84, .makeStyles-rememberUser-43': {
      margin: 0,
    },
    '& label': {
      marginLeft: '10px'
    }
  }
}))

export default useStyles
