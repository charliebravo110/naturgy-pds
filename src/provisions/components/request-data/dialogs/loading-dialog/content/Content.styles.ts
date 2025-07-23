import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '32px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '32px 12px',
      overflow: 'hidden'
    }
  },
  title: {
    width: '100%',
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)'
  },
  description: {
    width: '100%',
    color: '#555555'
  },
  closeButton: {
    position: 'absolute',
    top: 7,
    right: 7
  }
}))

export default useStyles