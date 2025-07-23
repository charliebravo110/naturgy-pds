import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 32
  },
  description: {
    color: '#004571',
    fontWeight: 'bold'
  },
  inputs: {
    width: 740,
    justifyContent: 'space-between',
    margin: '24px auto 0',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  label: {
    color: '#004571',
    fontSize: 14,
    marginBottom: 8
  }
}))

export default useStyles
