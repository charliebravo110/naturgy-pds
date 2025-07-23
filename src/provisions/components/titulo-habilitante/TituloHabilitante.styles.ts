import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dossierDateAdviseBox: {
    margin: '0 auto'
  },
  dossierDateAdviseContainer: {
    backgroundColor: '#FFF9E1',
    marginBottom: 20,
    padding: '25px 0',
    borderRadius: '5px',
    fontSize: '16px'
  },
  alertIcon: {
    width: 26
  },
  alertIconBox: {
    textAlign: 'center'
  },
  dossierDateAdviseTitle: {
    color: '#256094',
    fontSize: '18px'
  },
  description: {
    color: '#979596'
  },
  link: {
    color: '#1674D1',
    textDecoration: 'underline',
    cursor: 'pointer',
    display: 'table'
  }
}))

export default useStyles
