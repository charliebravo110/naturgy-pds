import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: '550px',
      heigth: '250px',
      border: '2px solid rgb(61, 114, 147)'
    }
  },
  container: {
    padding: 36,
    overflow: 'hidden'
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  inputCups:{
    marginBottom: '1rem', 
    width: '50%', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'stretch',
    '@media (max-width: 600px)': {
      width: '100%',     
    },
  },
  errorCups:{
    width: '100%', 
    textAlign: 'left', 
    marginTop: '0.25rem', 
    fontSize: '14px', 
    color: '#D3222A', 
  },
  text: {
    fontSize: 17,
    color: '#838383'
  },
  alertBlock: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  alertIcon: {
    height: '100%'
  },
  button: {
    marginTop: 25
  }
}))

export default useStyles