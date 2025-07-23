import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%'
  },
  container: {
    position: 'relative',
    width: '100%',
    padding: '25px 30px',
    backgroundColor: '#F8F7F6',
    borderRadius: '10px',
    [theme.breakpoints.only('xs')]: {
      padding: '15px 20px',
    }
  },
  label: {
    color: '#004571',
    fontSize: 15,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    backgroundColor: '#FFF',
    '& .MuiSelect-root': {
      color: '#868686'
    }
  },
  customInput: {
    backgroundColor: '#FFF',
    '& .MuiSelect-root': {
      color: '#868686'
    },
    padding: '17.5px 14px',
    fontSize: '1rem',
    '&:focus': {
      outline: 'none',
      borderWidth: 2,
      padding: '16.5px 13px'
    },
    border: 'solid 1px rgba(0, 69, 113, 0.5)',
    boxSizing: 'border-box',
    display: 'block',
    width: '100%',
    borderRadius: 4
  },
  marginRight: {
    marginRight: 10
  },
  ccv: {
    marginRight: 10,
    [theme.breakpoints.only('xs')]: {
      marginTop: '40px'
    }
  },
  whatCCV: {
    fontSize: 13,
    margin: '45px auto',
    [theme.breakpoints.only('xs')]: {
      marginTop: '80px'
    }
  },
  whatCCVLink: {
    color: 'rgba(0, 102, 204, 1)',
    textDecoration: 'underline'
  },
  hiddenForm: {
    display: 'none',
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
    height: 600,
    border: 0,
    [theme.breakpoints.down('lg')]: {
      width: '100%'
    }
  },
  ieAlertBox: {
    margin: '30% auto',
    width: '100%',
    textAlign: 'center'
  },
  ieAlertText: {
    color: '#004571',
    fontSize: 19,
    fontWeight: 'bold'
  },
  ieAlertIcon: {
    width: 60,
    height: 60
  }
}))

export default useStyles
