import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    padding: '24px 6px'
  },
  title: {
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)'
  },
  icon: {
    width: 60
  },
  description: {
    color: '#555555'
  },
  closeButton: {
    position: 'absolute',
    top: 7,
    right: 7
  }
}))

export default useStyles