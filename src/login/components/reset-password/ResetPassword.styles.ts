import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginBottom: 12
  },
  subtitle: {
    cursor: 'default',
    margin: '20px 74px 8px',
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
  
  text: {
    marginTop: 12,
    textAlign: 'center'
  },
  toLoginLink: {
    color: 'rgba(0, 102, 204, 1)',
    textDecoration: 'underline'
  },
  textField: {
    margin: '16px 0',
    width: '74%'
  },
  button: {
    marginTop: 32
  },
  checkboxContainer1: {
    marginTop: '20px',
  },
  checkboxContainer: {
    marginTop: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    margin: '0 auto'
  },
  checkboxBotom: {
    width: '15%',
  },
  checkboxItem: {
    width: '25%',
    textAlign: 'left'
  },
}))

export default useStyles
