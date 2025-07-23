import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#FFF',
    color: '#004571',
    alignItems: 'center',
    padding: '16px 32px',
    borderBottom: '4px solid #E97000',
    marginBottom: 38
  },
  icon: {
    textAlign: 'center',
    marginRight: 32,
    [theme.breakpoints.down('sm')]: {
      margin: '0 0 8px'
    }
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 6
  }
}))

export default useStyles
