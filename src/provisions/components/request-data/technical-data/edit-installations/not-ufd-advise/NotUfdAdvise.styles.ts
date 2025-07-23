import { makeStyles, withStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    margin: '20px 0'
  },
  icon: {
    width: '60px'
  },
  title: {
    color: '#004571',
    fontSize: 25
  },
  subtitle: {
    color: '#E77B11',
    fontWeight: 'bold',
    fontSize: 20
  }
}))

export default useStyles
