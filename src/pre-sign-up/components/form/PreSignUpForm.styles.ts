import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: 10,
    marginBottom: 10
  },
  divider: {
    width: '100%',
    marginTop: 10
  },
  preRegister: {
    textAlign: 'center',
    justifyContent: 'center'
  },
  blue: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '14px',
    marginTop: '20px',
    textAlign: 'left'
  },
  value: {
    textAlign: 'left'
  },
  usertype: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '14px',
    marginTop: '40px',
    marginBottom: '20px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infousertype: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '14px'
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
