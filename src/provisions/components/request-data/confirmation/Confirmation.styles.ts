import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  introMessage: {
    textAlign: 'center',
    color: '#004571'
  },
  dossierCodWrapper: {
    background: '#004571',
    color: 'white',
    borderRadius: 10,
    display: 'flex',
    padding: '18px 0',
    marginBottom: 15,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  dossierCod: {
    display: 'inline-block',
    backgroundColor: '#009AA6',
    fontWeight: 'bold',
    padding: '10px 32px',
    borderRadius: '20em',
    margin: '0 10px',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 54px',
      marginTop: 10
    }
  },
  confirmationMessage: {
    color: '#004571'
  },
  textBlock: {
    margin: '15px 0 20px',
    '& p': {
      margin: 0,
      textAlign: 'center'
    }
  },
  buttonBlock: {
    marginTop: 10,
    marginBottom: 30
  },
  greyText: {
    color: '#838383'
  }
}))

export default useStyles