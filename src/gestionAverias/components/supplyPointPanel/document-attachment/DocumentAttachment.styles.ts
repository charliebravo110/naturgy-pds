import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 32
  },
  description: {
    color: '#004571',
    fontWeight: 'bold',
    marginBottom: 24
  },
  attach: {
    alignItems: 'center'
  },
  button: {
    minWidth: '100% !important',
    fontSize: 14
  },
  help: {
    color: '#868686',
    fontSize: 14,
    marginTop: 4
  }
}))

export default useStyles
